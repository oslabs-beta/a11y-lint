import { Issue } from '../types/issue';
import { SCSSSelectorObj } from '../types/scss';
import appearanceRules from './ruleCategories/appearanceRules';
import contrastRules from './ruleCategories/contrastRules';
import keyboardRules from './ruleCategories/keyboardRules';
import { getClassTagPair } from '../core/dependencyGraph';
import { parse } from 'path';

// step 4- loops through the parsed CSS and applies our rules to them, if something fails, it creates an issue
export function SCSSRulesFromObject(
  parsedSCSS: SCSSSelectorObj,
  file: string,
  issues: Issue[] = []
): Issue[] {
  console.log('SCSSRules function reached ❄️');
  //looping through parsedCSS
  for (const selector in parsedSCSS) {
        let testSelector: string = selector;
        //lets us test class and ID selectors as the tag they're attached to
        if (selector.charAt(0) === '.' || selector.charAt(0) === '#'){
          testSelector = getClassTagPair(selector)!;
        }
    //grabbing each declaration
    const declarations = parsedSCSS[selector].declarations;
    //checking for button border
    contrastRules.checkButtonBorder(testSelector, parsedSCSS[selector], issues);
    //checking for appropriate color contrast
    contrastRules.checkContrast(testSelector, declarations, issues);
    //must have 200% scalable font
    appearanceRules.textSize200(testSelector, declarations, issues);
    //must have visible focus styles
    keyboardRules.checkVisibleFocusStyle(selector, parsedSCSS[selector], issues);
    keyboardRules.checkMissingFocusStyles(
              selector,
              testSelector,
              parsedSCSS[selector],
              issues,
              Object.keys(parsedSCSS)
            );

  }
  return issues;
}
