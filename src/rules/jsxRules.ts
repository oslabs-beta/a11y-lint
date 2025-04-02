// -----------------------------
// FILE: src/rules/jsxRules.ts
// DESCRIPTION: Contains accessibility rules specific to JSX files, such as missing alt
// attributes or improper ARIA roles.
// -----------------------------

import { Issue } from '../types/issue';
import { Node } from '../types/jsx';
import imageRules from './ruleCategories/imageRules';
import controlRules from './ruleCategories/controlRules';
import formRules from './ruleCategories/formRules';
import tableRules from './ruleCategories/tableRules';
import listRules from './ruleCategories/listRules';
import { cssRulesFromObject } from './cssRules';

export function jsxRules(parsedJsx: Node[], file: string): Issue[] {
  const issues: Issue[] = [];

  for (let i = 0; i < parsedJsx.length; i++) {
    //want to test all nodes for links EXCEPT <a> tags
    if (parsedJsx[i].type !== 'a') {
      controlRules.useATag(parsedJsx[i], issues);
    }
    //run in-line styling through CSS parser
    if (parsedJsx[i].styles) {
      cssRulesFromObject(parsedJsx[i].styles!, file, issues);
    }
    //want to check for potential list structures
    if (parsedJsx[i].value) {
      if (!parsedJsx[i].value?.charAt(0).match(/^[a-z]+$/i)){
      const node: Node = parsedJsx[i];
      const prevValue: Node | {value: string} = parsedJsx[i-1] || {value: ' '};
      const nextValue: Node | {value: string}  = parsedJsx[i+1] || {value: ' '};
      listRules.useListElements(
        parsedJsx[i],
        prevValue.value || ' ',
        nextValue.value || ' ',
        issues
      );}
    }

    //if our node is an img tag
    if (parsedJsx[i].type === 'img') {
      imageRules.hasAltText(parsedJsx[i], issues);
    } else if (parsedJsx[i].type === 'a') {
      controlRules.descriptiveLinks(parsedJsx[i], issues);
    } else if (parsedJsx[i].type === 'input') {
      //checks if the previous node is a label for the input
      formRules.labelInputs(parsedJsx[i], parsedJsx[i - 1], issues);
      controlRules.useButtonTag(parsedJsx[i], issues);
    } else if (parsedJsx[i].type === 'form') {
      formRules.useFieldsetLegend(
        parsedJsx[i],
        parsedJsx[i + 1],
        parsedJsx[i - 1],
        issues
      );
    } else if (
      parsedJsx[i].type === 'table'
    ) {
      const parsedSlice: Node[] = [parsedJsx[i]];
      //traverses our parsedJsx to find the closing tag for the table
      let j = i + 1;
      const isTableTag = {th: true, tr: true, td: true, caption: true, colgroup: true, col: true, thead: true, tbody: true, tfoot: true};
      while (j < parsedJsx.length && isTableTag.hasOwnProperty(String(parsedJsx[j].type))) {
        parsedSlice.push(parsedJsx[j]);
        j++;
      }
      //makes sure that it isn't the closing table tag,
      // then checks if two nodes after there is a <th> tag
      tableRules.hasHeaders(parsedSlice, issues);
      tableRules.usesCaption(parsedSlice, issues);
    }
  }
  return issues;
}
