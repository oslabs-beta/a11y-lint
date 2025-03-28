// -----------------------------
// FILE: src/rules/jsxRules.ts
// DESCRIPTION: Contains accessibility rules specific to JSX files, such as missing alt
// attributes or improper ARIA roles.
// -----------------------------

import { Issue } from '../types/issue';
import { Node } from '../types/jsx';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import imageRules from './ruleCategories/imageRules';
import controlRules from './ruleCategories/controlRules';
import formRules from './ruleCategories/formRules';
import tableRules from './ruleCategories/tableRules';

export function jsxRules(parsedJsx: Node[], file: string): Issue[] {
  const issues: Issue[] = [];
  for (let i = 0; i < parsedJsx.length; i++) {
    //if our node is an img tag
    if (parsedJsx[i].type === 'img') {
      imageRules.hasAltText(parsedJsx[i], issues);
    } else if (parsedJsx[i].type === 'a') {
      controlRules.descriptiveLinks(parsedJsx[i], issues);
    } else if (
      parsedJsx[i].type === 'input' &&
      parsedJsx[i - 1].type !== 'tr'
    ) {
      //checks if the previous node is a label for the input
      formRules.labelInputs(parsedJsx[i], parsedJsx[i - 1], issues);
    } else if (
      parsedJsx[i].type === 'table' &&
      parsedJsx[i - 1].type !== 'tr'
    ) {
      const parsedSlice: Node[] = [parsedJsx[i]];
      //traverses our parsedJsx to find the closing tag for the table
      let j = i + 1;
      while (parsedJsx[j].type !== 'table' && j < parsedJsx.length) {
        parsedSlice.push(parsedJsx[j]);
      }
      //makes sure that it isn't the closing table tag,
      // then checks if two nodes after there is a <th> tag
      // tableRules.hasHeaders(parsedJsx[i], parsedJsx[i - 1], parsedJsx[i + 2], issues);
      tableRules.hasHeadersBetter(parsedSlice, issues);
    }
  }
  return issues;
}
