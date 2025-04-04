// -----------------------------
// FILE: src/rules/htmlRules.ts
// DESCRIPTION: Contains accessibility rules specific to HTML documents.
// -----------------------------
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
import { CssSelectorObj } from '../types/css';
import { getSelectorDeclarations } from '../core/dependencyGraph';
import { splitSelector } from '../core/splitSelector';

import globalCodeRules from './ruleCategories/globalCodeRules';
import imageRules from './ruleCategories/imageRules';
import controlRules from './ruleCategories/controlRules';
import formRules from './ruleCategories/formRules';
import tableRules from './ruleCategories/tableRules';
import listRules from './ruleCategories/listRules';
import { cssRulesFromObject } from './cssRules';
const allRules = {
  ...globalCodeRules,
};

// step 4- loops through the parsed HTML and applies our rules to them, if something fails, it creates an issue
export function htmlRules(
  nodes: HtmlExtractedNode[],
  filePath: string
): Issue[] {
  const issues: Issue[] = [];
  //run html rules
  for (const node of nodes) {
    for (const ruleKey in allRules) {
      const ruleFn = allRules[ruleKey];
      const issue = ruleFn(node);
      console.log(allRules);
      if (issue) {
        issues.push(issue);
      }
    }
  }
  //create a fake CSS object from class/id uses
  const virtualCSS: CssSelectorObj = {};

  for (const node of nodes) {
    const attrs = node.attributes || {};
    const lineInfo = {
      startLine: node.location?.startLine || 0,
      startColumn: node.location?.startColumn || 0,
      endLine: node.location?.endLine || 0,
      endColumn: node.location?.endColumn || 0,
    };

    if (attrs.class) {
      attrs.class.value.split(/\s+/).forEach((cls) => {
        const selector = `.${cls}`;
        const declarationsFromCss = getSelectorDeclarations(selector); // get real CSS info

        virtualCSS[selector] = {
          ...lineInfo,
          declarations: declarationsFromCss?.declarations || {},
        };
      });
    }

    if (attrs.id) {
      const selector = `#${attrs.id.value}`;
      const declarationsFromCss = getSelectorDeclarations(selector); // get real CSS info

      virtualCSS[selector] = {
        ...lineInfo,
        declarations: declarationsFromCss?.declarations || {},
      };
    }
  }

  // run CSS rules on all selectors used in HTML
  const cssIssues = cssRulesFromObject(virtualCSS, filePath);

  // attach issues to the JSX nodes based on matching selector
  for (const issue of cssIssues) {
    if (!issue.selector) {
      continue;
    }

    const selectorParts = splitSelector(issue.selector || '');

    const match = nodes.find((node) => {
      const attrs = node.attributes || {};
      const classList = attrs.class?.value?.split(/\s+/) || [];
      const id = attrs.id?.value;
      const tag = node.type;

      return selectorParts.some((part) => {
        if (part.startsWith('.')) {
          return classList.includes(part.slice(1));
        }
        if (part.startsWith('#')) {
          return part.slice(1) === id;
        }
        return part === tag;
      });
    });

    if (match?.location) {
      issue.line = match.location.startLine || 0;
      issue.column = match.location.startColumn;
      issue.endLine = match.location.endLine || 0;
      issue.endColumn = match.location.endColumn;
    }
    // console.log(
    //   `🎯 Matched selector "${issue.selector}" to HTML tag <${match?.type}> at line ${issue.line}`
    // );

    issues.push(issue);
  }
  for (let i = 0; i < nodes.length; i++) {
  //   //want to test all nodes for links EXCEPT <a> tags
    if (nodes[i].type !== 'a') {
      controlRules.useATag(nodes[i], issues);
    }
  //   //run in-line styling through CSS parser
    if (nodes[i].styles) {
      cssRulesFromObject(nodes[i].styles!, '', issues);
    }
  //   //want to check for potential list structures
    if (nodes[i].value) {
      const node: HtmlExtractedNode = nodes[i];
      const prevValue: HtmlExtractedNode | {value: string} = nodes[i-1] || {value: ' '};
      const nextValue: HtmlExtractedNode | {value: string}  = nodes[i+1] || {value: ' '};
      listRules.useListElements(
        nodes[i],
        prevValue.value || ' ',
        nextValue.value || ' ',
        issues
      );
    }

  //   //if our node is an img tag
    if (nodes[i].type === 'img') {
      imageRules.hasAltText(nodes[i], issues);
    } else if (nodes[i].type === 'a') {
      controlRules.descriptiveLinks(nodes[i], issues);
    } else if (nodes[i].type === 'input') {
  //     //checks if the previous node is a label for the input
      formRules.labelInputs(nodes[i], nodes[i - 1], issues);
      controlRules.useButtonTag(nodes[i], issues);
    } else if (nodes[i].type === 'form') {
      formRules.useFieldsetLegend(
        nodes[i],
        nodes[i + 1],
        nodes[i - 1],
        issues
      );
    } else if (
      nodes[i].type === 'table'
    ) {
      const parsedSlice: HtmlExtractedNode[] = [nodes[i]];
      //traverses our parsedJsx to find the closing tag for the table
      let j = i + 1;
      const isTableTag = {th: true, tr: true, td: true, caption: true, colgroup: true, col: true, thead: true, tbody: true, tfoot: true};
      while (j < nodes.length && isTableTag.hasOwnProperty(String(nodes[j].type))) {
        parsedSlice.push(nodes[j]);
        j++;
      }
      //makes sure that it isn't the closing table tag,
      // then checks if two nodes after there is a <th> tag
      tableRules.hasHeaders(parsedSlice, issues);
      tableRules.usesCaption(parsedSlice, issues);
    }
  }
  return issues;
}
