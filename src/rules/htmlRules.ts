// -----------------------------
// FILE: src/rules/htmlRules.ts
// DESCRIPTION: Contains accessibility rules specific to HTML documents.
// -----------------------------
import {Issue} from '../types/issue'
import {HtmlExtractedNode} from '../types/html'
// step 4- loops through the parsed HTML and applies our rules to them, if something fails, it creates an issue
export function htmlRules(node: HtmlExtractedNode[], filePath: string): Issue[] {

function checkForMissingAlt(node: HtmlExtractedNode) {

  console.log(node)
  
 // TODO: Check HTML AST nodes
}
return [] 
}