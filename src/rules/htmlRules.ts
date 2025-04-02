// -----------------------------
// FILE: src/rules/htmlRules.ts
// DESCRIPTION: Contains accessibility rules specific to HTML documents.
// -----------------------------
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
import globalCodeRules from '../rules/ruleCategories/globalCodeRules';
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
console.log(nodes)
  for (const node of nodes) {
    for (const ruleKey in allRules) {
      const ruleFn = allRules[ruleKey];
      const issue = ruleFn(node);
      console.log(allRules)
      if (issue) {
        issues.push(issue);
      }
    }
  }

  return issues;
}