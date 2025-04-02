// -----------------------------
// FILE: src/rules/cssRules.ts
// DESCRIPTION: Contains accessibility rules specific to CSS, like detecting lack of focus
// styles or poor color contrast.
// -----------------------------

import { Issue } from '../types/issue';
import { CssSelectorObj } from '../types/css';
//inport rules
import appearanceRules from './ruleCategories/appearanceRules';
import contrastRules from './ruleCategories/contrastRules';
import keyboardRules from './ruleCategories/keyboardRules';

// step 4- loops through the parsed CSS and applies our rules to them, if something fails, it creates an issue
export function cssRulesFromObject(
  parsedCSS: CssSelectorObj,
  file: string,
  issues: Issue[] = []
): Issue[] {
  console.log('cssRules function reached ❄️');
  //create issues array
  //looping through parsedCSS
  console.log(parsedCSS);
  for (const selector in parsedCSS) {
    //grabbing each declaration
    const declarations = parsedCSS[selector].declarations;
    //checking for button border
    contrastRules.checkButtonBorder(selector, parsedCSS[selector], issues);
    //checking for appropriate color contrast
    contrastRules.checkContrast(selector, declarations, issues);
    //must have 200% scalable font
    appearanceRules.textSize200(selector, declarations, issues);
    //must have visible focus styles
    keyboardRules.checkVisibleFocusStyle(selector, parsedCSS[selector], issues);
    //if an element is interactive it needs focus styling
    // keyboardRules.checkMissingFocusStyles(
    //   selector,
    //   parsedCSS[selector],
    //   issues,
    //   focusSelectors
    // );
  }
  return issues;
}
