// -----------------------------
// FILE: src/rules/cssRules.ts
// DESCRIPTION: Contains accessibility rules specific to CSS, like detecting lack of focus
// styles or poor color contrast.
// -----------------------------

import { Issue } from '../types/issue';
import { cssSelectorObj } from '../types/css';
import tinycolor from 'tinycolor2';
//inport rules
import appearanceRules from './ruleCategories/appearanceRules';
import contrastRules from './ruleCategories/contrastRules';

// step 4- loops through the parsed CSS and applies our rules to them, if something fails, it creates an issue
export function cssRulesFromObject(
  parsedCSS: cssSelectorObj,
  file: string
): Issue[] {
  console.log('cssRules function reached ❄️');
  //create issues array
  const issues: Issue[] = [];
  //looping through parsedCSS
  console.log(parsedCSS);
  for (const selector in parsedCSS) {
    //grabbing each declaration
    const declarations = parsedCSS[selector];

    //checking for appropriate color contrast
    contrastRules.checkContrast(declarations, issues);

    //then we loop through declarations
    for (const decl in declarations) {
      console.log('Decl: ', decl);

      //must have 200% scalable font
      appearanceRules.textSize200(declarations, decl, issues);
    }
  }

  return issues;
}
