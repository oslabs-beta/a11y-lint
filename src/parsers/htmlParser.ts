// -----------------------------
// FILE: src/parsers/htmlParser.ts
// DESCRIPTION: Uses parser to parse HTML files and applies HTML-specific rules.
// -----------------------------
import { parse } from 'parse5';
import { htmlRules } from '../rules/htmlRules';
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
//pass the html file to the parser
export function parseHTML(code: string, filePath: string): Issue[] {
  const document = parse(code, { sourceCodeLocationInfo: true });

  const extractElements = (
    node: any,
    output: HtmlExtractedNode[] = []
  ): HtmlExtractedNode[] => {
    const cache: Partial<HtmlExtractedNode> = {};

  if (node.tagName) {
    cache.type = node.tagName;


    
    // Get attribute values as a key-value pair
    const attributes:{
      [k: string]: { value: String;   location?: {
        startLine: number;
        startCol: number;
        endLine: number;
        endCol: number;
      };};
    } = {};
    
    if (Array.isArray(node.attrs)) {
      for (const attr of node.attrs) {
        attributes[attr.name] = { value: attr.value };
      }
    }
    cache.attributes = attributes;

    // ✅ Extract attribute locations
    const attrLocations = {};
    const attrLocs = node.sourceCodeLocation?.attrs;
    if (attrLocs) {
      for (const attrName in attrLocs) {
        attributes[attrName].location = {
            startLine: attrLocs[attrName].startLine,
            startCol: attrLocs[attrName].startCol,
            endLine: attrLocs[attrName].endLine,
            endCol: attrLocs[attrName].endCol,
        };
      }
    }
    // cache.attributeLocations = attrLocations;

    // Element location
    cache.location = {
      startLine: node.sourceCodeLocation.startLine,
      startCol: node.sourceCodeLocation.startCol,
      endLine: node.sourceCodeLocation.endLine,
      endCol: node.sourceCodeLocation.endCol,
    };
  }

  // Handle children
  if (node.childNodes) {
    for (const child of node.childNodes) {
      if (child.value) {
        cache.value = child.value;
      }
    }

    if (Object.keys(cache).length > 1) {
      output.push(cache as HtmlExtractedNode);
    }

    return output;
  };
  const htmlElements = extractElements(document);
  return htmlRules(htmlElements, filePath);
}
