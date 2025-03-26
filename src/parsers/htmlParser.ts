// -----------------------------
// FILE: src/parsers/htmlParser.ts
// DESCRIPTION: Uses parser to parse HTML files and applies HTML-specific rules.
// -----------------------------
import {parse} from 'parse5'
import {htmlRules} from '../rules/htmlRules'
import {Issue} from '../types/issue'
import {HtmlExtractedNode} from '../types/html'
//pass the html file to the parser
export function parseHTML(code: string, filePath: string):Issue[]{
const document = parse(code, {sourceCodeLocationInfo:true})

const extractElements = (
  node: any,
  output: HtmlExtractedNode[] = []
): HtmlExtractedNode[] => {
  const cache: Partial<HtmlExtractedNode> = {};

  if (node.tagName) {
    cache.type = node.tagName;
    cache.attributes = node.attrs || {};
    cache.location = {
      startLine: node.sourceCodeLocation.startLine,
      startCol: node.sourceCodeLocation.startCol,
      endLine: node.sourceCodeLocation.endLine,
      endCol: node.sourceCodeLocation.endCol,
    };
  }

  if (node.childNodes) {
    for (const child of node.childNodes) {
      if (child.value) {
        cache.value = child.value;
      }
      extractElements(child, output);
    }
  }

  if (Object.keys(cache).length > 1) {
    output.push(cache as HtmlExtractedNode);
  }

  return output;
}
const htmlElements = extractElements(document);
return htmlRules(htmlElements, filePath)
}

