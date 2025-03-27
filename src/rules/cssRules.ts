// -----------------------------
// FILE: src/rules/cssRules.ts
// DESCRIPTION: Contains accessibility rules specific to CSS, like detecting lack of focus
// styles or poor color contrast.
// -----------------------------

import { Issue } from '../types/issue';
import { cssSelectorObj } from '../types/cssType';
import tinycolor from "tinycolor2";

// step 4- loops through the parsed CSS and applies our rules to them, if something fails, it creates an issue
export function cssRulesFromObject(
  parsedCSS: cssSelectorObj,
  file: string
): Issue[] {
  console.log('cssRules function reached ❄️')
  const issues: Issue[] = [];
  //looping through parsedCSS
  console.log(parsedCSS);
  for (const selector in parsedCSS) {
    //grabbing each declaration
    const declarations = parsedCSS[selector];
    //then we loop through declarations
    for (const decl in declarations) {
      console.log('Decl: ', decl)
      //grab each decleration of each pro
      //must have readable minimun font size
      if (decl === 'font-size') {
        console.log('you are in if statement 🧛‍♂️')
        //get the value of the font size
        const numericValue = parseInt(declarations[decl].value);
        console.log(numericValue)

        if (numericValue < 16) {
          issues.push({
            file,
            line: declarations[decl].startLine,
            column: declarations[decl].startColumn,
            endLine: declarations[decl].endLine,
            endColumn: declarations[decl].endColumn,
            message: `Font size of ${numericValue}px is too small for readability.`,
            fix: 'Use at least 16px font size for body text.',
            severity: 'warning',
          });
        }
      }
    }
  }
  for (const selector in parsedCSS) {
    const declarations = parsedCSS[selector];
      if(declarations['color'] && declarations['background-color']) {
        console.log('you are in contrast if statement 🍣')
        let color = tinycolor(declarations['color'].value);
        console.log(color)
        const backgroundColor = tinycolor(declarations['background-color'].value)
        if(tinycolor.isReadable(color.toHexString(), backgroundColor.toHexString()) === false) {
          issues.push({
            file,
            line: declarations['color'].startLine,
            column: declarations['color'].startColumn,
            endLine: declarations['color'].endLine,
            endColumn: declarations['color'].endColumn,
            message: `Contrast is not high enough.`,
            fix: 'Choose color with higher contrast`',
            severity: 'warning',
        })
        }
      }
    }
    return issues;
  };
