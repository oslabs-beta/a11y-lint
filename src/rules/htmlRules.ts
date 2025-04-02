// -----------------------------
// FILE: src/rules/htmlRules.ts
// DESCRIPTION: Contains accessibility rules specific to HTML documents.
// -----------------------------
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
import globalCodeRules from '../rules/ruleCategories/globalCodeRules';
import { cssRulesFromObject } from './cssRules';
import { CssSelectorObj } from '../types/css';
import { getSelectorDeclarations } from '../core/dependencyGraph';
import { splitSelector } from '../core/splitSelector';
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
      startColumn: node.location?.startCol || 0,
      endLine: node.location?.endLine || 0,
      endColumn: node.location?.endCol || 0,
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
      issue.column = match.location.startCol;
      issue.endLine = match.location.endLine || 0;
      issue.endColumn = match.location.endCol;
    }
    // console.log(
    //   `🎯 Matched selector "${issue.selector}" to HTML tag <${match?.type}> at line ${issue.line}`
    // );

    issues.push(issue);
  }

  return issues;
}
