// -----------------------------
// FILE: src/rules/jsxRules.ts
// DESCRIPTION: Contains accessibility rules specific to JSX files, such as missing alt
// attributes or improper ARIA roles.
// -----------------------------

import { Issue } from '../types/issue';
import { Node } from '../types/jsx';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import imageRules from './ruleCategories/imageRules';
import controlRules from './ruleCategories/controlRules';
import formRules from './ruleCategories/formRules';
import tableRules from './ruleCategories/tableRules';
import listRules from './ruleCategories/listRules';
import { cssRulesFromObject } from './cssRules';
import { DebugConsoleMode } from 'vscode';
import { getSelectorDeclarations } from '../core/dependencyGraph';
import { CssSelectorObj } from '../types/css';
import { splitSelector } from '../core/splitSelector';

export function jsxRules(parsedJsx: Node[], file: string): Issue[] {
  const issues: Issue[] = [];
  console.log('ENTERED JSX RULES');
  for (let i = 0; i < parsedJsx.length; i++) {
    //want to test all nodes for links EXCEPT <a> tags
    if (parsedJsx[i].type !== 'a') {
      controlRules.useATag(parsedJsx[i], issues);
    }
    //run in-line styling through CSS parser
    if (parsedJsx[i].styles) {
      cssRulesFromObject(parsedJsx[i].styles!, file, issues);
    }
    //want to check for potential list structures
    if (parsedJsx[i].value) {
      const node: Node = parsedJsx[i];
      const prevValue: Node | { value: string } = parsedJsx[i - 2] || {
        value: ' ',
      };
      const nextValue: Node | { value: string } = parsedJsx[i + 2] || {
        value: ' ',
      };
      listRules.useListElements(
        parsedJsx[i],
        prevValue.value || ' ',
        nextValue.value || ' ',
        issues
      );
    }

    //if our node is an img tag
    if (parsedJsx[i].type === 'img') {
      imageRules.hasAltText(parsedJsx[i], issues);
    } else if (parsedJsx[i].type === 'a') {
      controlRules.descriptiveLinks(parsedJsx[i], issues);
    } else if (parsedJsx[i].type === 'input') {
      //checks if the previous node is a label for the input
      formRules.labelInputs(parsedJsx[i], parsedJsx[i - 1], issues);
      controlRules.useButtonTag(parsedJsx[i], issues);
    } else if (parsedJsx[i].type === 'form') {
      formRules.useFieldsetLegend(
        parsedJsx[i],
        parsedJsx[i + 1],
        parsedJsx[i - 1],
        issues
      );
    } else if (
      parsedJsx[i].type === 'table' &&
      parsedJsx[i - 1].type !== 'tr'
    ) {
      const parsedSlice: Node[] = [parsedJsx[i]];
      //traverses our parsedJsx to find the closing tag for the table
      let j = i + 1;
      while (parsedJsx[j].type !== 'table' && j < parsedJsx.length - 1) {
        parsedSlice.push(parsedJsx[j]);
        j++;
      }
      //makes sure that it isn't the closing table tag,
      // then checks if two nodes after there is a <th> tag
      // tableRules.hasHeaders(parsedJsx[i], parsedJsx[i - 1], parsedJsx[i + 2], issues);
      tableRules.hasHeadersBetter(parsedSlice, issues);
      tableRules.usesCaption(parsedSlice, issues);
    }
  }

  //create a fake CSS object from class/id uses
  const virtualCSS: CssSelectorObj = {};

  for (const node of parsedJsx) {
    const attrs = node.attributes || {};
    const lineInfo = {
      startLine: node.location?.lineStart || 0,
      startColumn: node.location?.colStart || 0,
      endLine: node.location?.lineEnd || 0,
      endColumn: node.location?.colEnd || 0,
    };

    if (attrs.className) {
      attrs.className.value.split(/\s+/).forEach((cls) => {
        const selector = `.${cls}`;
        const fromCSS = getSelectorDeclarations(selector); //get real css info
        virtualCSS[selector] = {
          ...lineInfo,
          declarations: fromCSS?.declarations || {},
        };
      });
    }

    if (attrs.id) {
      const selector = `#${attrs.id.value}`;
      const fromCSS = getSelectorDeclarations(selector); //get real css info
      virtualCSS[selector] = {
        ...lineInfo,
        declarations: fromCSS?.declarations || {},
      };
    }
  }

  // run CSS rules on all selectors used in JSX
  const cssIssues = cssRulesFromObject(virtualCSS, file);

  // attach issues to the JSX nodes based on matching selector
  for (const issue of cssIssues) {
    if (!issue.selector) {
      continue;
    }

    const selectorParts = splitSelector(issue.selector);
    const match = parsedJsx.find((node) => {
      const attrs = node.attributes || {};
      const classList = attrs.className?.value?.split(/\s+/) || [];
      const id = attrs.id?.value;
      return selectorParts.some(
        (sel) =>
          (sel.startsWith('.') && classList.includes(sel.slice(1))) ||
          (sel.startsWith('#') && sel.slice(1) === id)
      );
    });

    if (match?.location) {
      issue.line = match.location.lineStart || 0;
      issue.column = match.location.colStart;
      issue.endLine = match.location.lineEnd || 0;
      issue.endColumn = match.location.colEnd;
    }

    issues.push(issue);
  }

  return issues;
}
