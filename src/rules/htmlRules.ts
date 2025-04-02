// -----------------------------
// FILE: src/rules/htmlRules.ts
// DESCRIPTION: Contains accessibility rules specific to HTML documents.
// -----------------------------
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
import globalCodeRules from '../rules/ruleCategories/globalCodeRules';
import imageRules from './ruleCategories/imageRules';
import controlRules from './ruleCategories/controlRules';
import formRules from './ruleCategories/formRules';
import tableRules from './ruleCategories/tableRules';
import listRules from './ruleCategories/listRules';
import { cssRulesFromObject } from './cssRules';
// const allRules = {
//   ...globalCodeRules,
// };


// step 4- loops through the parsed HTML and applies our rules to them, if something fails, it creates an issue
export function htmlRules(
  parsedJsx: HtmlExtractedNode[],
  filePath: string
): Issue[] {
  const issues: Issue[] = [];

  // for (const node of nodes) {
  //   for (const ruleKey in allRules) {
  //     const ruleFn = allRules[ruleKey];
  //     const issue = ruleFn(node);
  //     console.log(allRules)
  //     if (issue) {
  //       issues.push(issue);
  //     }
  //   }
  // }

  for (let i = 0; i < parsedJsx.length; i++) {
    //want to test all nodes for links EXCEPT <a> tags
    if (parsedJsx[i].type !== 'a') {
      controlRules.useATag(parsedJsx[i], issues);
    }
    //run in-line styling through CSS parser
    if (parsedJsx[i].styles) {
      cssRulesFromObject(parsedJsx[i].styles!, '', issues);
    }
    //want to check for potential list structures
    if (parsedJsx[i].value) {
      const node: HtmlExtractedNode = parsedJsx[i];
      const prevValue: HtmlExtractedNode | {value: string} = parsedJsx[i-2] || {value: ' '};
      const nextValue: HtmlExtractedNode | {value: string}  = parsedJsx[i+2] || {value: ' '};
      listRules.useListElements(
        parsedJsx[i],
        prevValue.value || ' ',
        nextValue.value || ' ',
        issues
      );
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
      parsedJsx[i].type === 'table' &&
      parsedJsx[i - 1].type !== 'tr'
    ) {
      const parsedSlice: HtmlExtractedNode[] = [parsedJsx[i]];
      //traverses our parsedJsx to find the closing tag for the table
      let j = i + 1;
      while (parsedJsx[j].type !== 'table' && j < parsedJsx.length - 1) {
        parsedSlice.push(parsedJsx[j]);
        j++;
      }
      //makes sure that it isn't the closing table tag,
      // then checks if two nodes after there is a <th> tag
      // tableRules.hasHeaders(parsedJsx[i], parsedJsx[i - 1], parsedJsx[i + 2], issues);
      tableRules.hasHeadersBetter(parsedSlice, issues);
      tableRules.usesCaption(parsedSlice, issues);
    }
  }
  return issues;
}