// -----------------------------
// FILE: src/rules/jsxRules.ts
// DESCRIPTION: Contains accessibility rules specific to JSX files, such as missing alt
// attributes or improper ARIA roles.
// -----------------------------

import { Issue } from '../types/issue';
import { Node } from '../types/jsx';

export function jsxRules(parsedJsx: Node[], file: string): Issue[] {
  const issues: Issue[] = [];
  for (let i = 0; i < parsedJsx.length; i++) {
    //if our node is an img tag
    if (parsedJsx[i].type === 'img') {
      //check if it has any attributes at all
      if (!parsedJsx[i].attributes.hasOwnProperty('alt')) {
        //if not, push a missing altId issue
        issues.push({
          file,
          line: parsedJsx[i].location.lineStart,
          column: parsedJsx[i].location.colStart,
          endLine: parsedJsx[i].location.lineEnd,
          endColumn: parsedJsx[i].location.colEnd,
          message: `Images should have alt ID.`,
          fix: 'Please add "alt" attribute. Decorative/nonfunctional images may use empty string as alt ID.',
          severity: 'warning',
        });
      }
    }
  }
  return issues; // TODO: Check JSX AST nodes
}
