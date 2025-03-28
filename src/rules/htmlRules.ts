// -----------------------------
// FILE: src/rules/htmlRules.ts
// DESCRIPTION: Contains accessibility rules specific to HTML documents.
// -----------------------------
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
import globalCodeRules from '../rules/ruleCategories/globalCodeRules';
const allRules = {
  ...globalCodeRules,
};


// step 4- loops through the parsed HTML and applies our rules to them, if something fails, it creates an issue
export function htmlRules(
  nodes: HtmlExtractedNode[],
  filePath: string
): Issue[] {
  const issues: Issue[] = [];

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