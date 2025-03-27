// -----------------------------
// FILE: src/rules/htmlRules.ts
// DESCRIPTION: Contains accessibility rules specific to HTML documents.
// -----------------------------
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
// step 4- loops through the parsed HTML and applies our rules to them, if something fails, it creates an issue
export function htmlRules(
  node: HtmlExtractedNode[],
  filePath: string
): Issue[] {
  const issues: Issue[] = [];

  function htmlRules(node) {
    if (!node.childNodes) return;

    for (const child of node.childNodes) {
      if (child.tagName === 'img') {
        const hasAlt = child.attrs.some((attr) => attr.name === 'alt');
        if (!hasAlt) {
          console.warn(`❗ <img> tag is missing alt attribute`);
        }
      }
      checkForMissingAlt(child); // Recurse
    }
  }

  return issues; // TODO: Check HTML AST nodes
}
