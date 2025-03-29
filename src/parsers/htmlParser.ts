import { parse } from 'parse5';
import { htmlRules } from '../rules/htmlRules';
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
// -----------------------------
// Parses HTML string, extracts elements, applies rules
// -----------------------------
export function parseHTML(code: string, filePath: string): Issue[] {
  const document = parse(code, { sourceCodeLocationInfo: true });
  const extractElements = (
    node: any,
    output: HtmlExtractedNode[] = []
  ): HtmlExtractedNode[] => {
    const cache: Partial<HtmlExtractedNode> = {};

    if (node.tagName) {
      cache.type = node.tagName;

      const attributes: {
        [k: string]: {
          value: string;
          location?: {
            startLine: number;
            startCol: number;
            endLine: number;
            endCol: number;
          };
        };
      } = {};
      
      if (Array.isArray(node.attrs)) {
        for (const attr of node.attrs) {
          attributes[attr.name] = { value: attr.value };
        }
      }

      const attrLocs = node.sourceCodeLocation?.attrs;
      if (attrLocs) {
        for (const attrName in attrLocs) {
          if (attributes[attrName]) {
            attributes[attrName].location = {
              startLine: attrLocs[attrName].startLine,
              startCol: attrLocs[attrName].startCol,
              endLine: attrLocs[attrName].endLine,
              endCol: attrLocs[attrName].endCol,
            };
          }
        }
      }

      cache.attributes = attributes;

      cache.location = {
        startLine: node.sourceCodeLocation.startLine,
        startCol: node.sourceCodeLocation.startCol,
        endLine: node.sourceCodeLocation.endLine,
        endCol: node.sourceCodeLocation.endCol,
      };
    }

    // Recursively visit child nodes
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
  };

  const htmlElements = extractElements(document);
  return htmlRules(htmlElements, filePath);
}
