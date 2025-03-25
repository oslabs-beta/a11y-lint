// -----------------------------
// FILE: src/rules/cssRules.ts
// DESCRIPTION: Contains accessibility rules specific to CSS, like detecting lack of focus
// styles or poor color contrast.
// -----------------------------

import { Issue } from '../types/issue';
import { CSSDeclaration, ParsedCSS } from '../types/css';

export function cssRulesFromObject(
  parsedCSS: ParsedCSS,
  file: string
): Issue[] {
  const issues: Issue[] = [];
  //looping through parsedCSS
  for (const selector in parsedCSS) {
    //grabbing each declaration
    const declarations = parsedCSS[selector];
    //then we loop through declarations
    for (const prop in declarations) {
      //grab each decleration of each prop
      const decl = declarations[prop];

      //we put the rules below here

      //must have readable minimun font size
      if (prop === 'font-size') {
        //get the value of the font size
        const numericValue = parseInt(decl.value);

        if (numericValue < 12) {
          issues.push({
            file,
            line: decl.start.line,
            column: decl.start.column,
            endLine: decl.end.line,
            endColumn: decl.end.column,
            message: `Font size of ${numericValue}px is too small for readability.`,
            fix: 'Use at least 12px font size for body text.',
            severity: 'warning',
          });
        }
      }
    }
  }

  return issues;
}
