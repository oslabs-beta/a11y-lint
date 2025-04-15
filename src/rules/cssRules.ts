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
import { getClassTagPair } from '../core/dependencyGraph';
import { parse } from 'path';

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
        let testSelector: string = selector;
        //lets us test class and ID selectors as the tag they're attached to
        if (selector.charAt(0) === '.' || selector.charAt(0) === '#'){
          testSelector = getClassTagPair(selector)!;
        }
    //grabbing each declaration
    const declarations = parsedCSS[selector].declarations;
    //checking for button border
    contrastRules.checkButtonBorder(testSelector, parsedCSS[selector], issues);
    //checking for appropriate color contrast
    contrastRules.checkContrast(testSelector, declarations, issues);
    //must have 200% scalable font
    appearanceRules.textSize200(testSelector, declarations, issues);
    //must have visible focus styles
    keyboardRules.checkVisibleFocusStyle(selector, parsedCSS[selector], issues);
    keyboardRules.checkMissingFocusStyles(
              selector,
              testSelector,
              parsedCSS[selector],
              issues,
              Object.keys(parsedCSS)
            );

  }
  return issues;
}
