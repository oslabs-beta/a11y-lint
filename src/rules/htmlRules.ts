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
const allRules = {
  ...globalCodeRules,
};


// step 4- loops through the parsed HTML and applies our rules to them, if something fails, it creates an issue
export function htmlRules(
  nodes: HtmlExtractedNode[],
  filePath: string
): Issue[] {
  const issues: Issue[] = [];

  for (const node of nodes) {
    for (const ruleKey in allRules) {
      const ruleFn = allRules[ruleKey];
      const issue = ruleFn(node);
      console.log(allRules)
      if (issue) {
        issues.push(issue);
      }
    }
  }

  for (let i = 0; i < nodes.length; i++) {
  //   //want to test all nodes for links EXCEPT <a> tags
  console.log("testing current node: ", nodes[i]);
    if (nodes[i].type !== 'a') {
      controlRules.useATag(nodes[i], issues);
    }
  //   //run in-line styling through CSS parser
    if (nodes[i].styles) {
      console.log('styles attribute info: ', nodes[i].styles);
      cssRulesFromObject(nodes[i].styles!, '', issues);
      console.log('issues after running CSS rules: ', issues);
    }
  //   //want to check for potential list structures
    if (nodes[i].value) {
      const node: HtmlExtractedNode = nodes[i];
      const prevValue: HtmlExtractedNode | {value: string} = nodes[i-1] || {value: ' '};
      const nextValue: HtmlExtractedNode | {value: string}  = nodes[i+1] || {value: ' '};
      listRules.useListElements(
        nodes[i],
        prevValue.value || ' ',
        nextValue.value || ' ',
        issues
      );
    }

  //   //if our node is an img tag
    if (nodes[i].type === 'img') {
      imageRules.hasAltText(nodes[i], issues);
    } else if (nodes[i].type === 'a') {
      controlRules.descriptiveLinks(nodes[i], issues);
    } else if (nodes[i].type === 'input') {
  //     //checks if the previous node is a label for the input
      formRules.labelInputs(nodes[i], nodes[i - 1], issues);
      controlRules.useButtonTag(nodes[i], issues);
    } else if (nodes[i].type === 'form') {
      formRules.useFieldsetLegend(
        nodes[i],
        nodes[i + 1],
        nodes[i - 1],
        issues
      );
    } else if (
      nodes[i].type === 'table' &&
      nodes[i - 1].type !== 'tr'
    ) {
      const parsedSlice: HtmlExtractedNode[] = [nodes[i]];
      //traverses our parsedJsx to find the closing tag for the table
      let j = i - 1;
      const isTableTag = {th: true, tr: true, td: true, caption: true, colgroup: true, col: true, thead: true, tbody: true, tfoot: true};
      while (j > 0 && isTableTag.hasOwnProperty(String(nodes[j].type))) {
        console.log('while loop');
        console.log('j: ', j);
        parsedSlice.push(nodes[j]);
        j--;
      }
      //makes sure that it isn't the closing table tag,
      // then checks if two nodes after there is a <th> tag
      tableRules.hasHeaders(parsedSlice, issues);
      tableRules.usesCaption(parsedSlice, issues);
    }
  }
  return issues;
}