import { parse } from 'parse5';
import { htmlRules } from '../rules/htmlRules';
import { Issue } from '../types/issue';
import { HtmlExtractedNode } from '../types/html';
import { Declarations, CssSelectorObj } from '../types/css';
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
          if (attr.name !== 'style') {
            attributes[attr.name] = { value: attr.value };
          } else {
            const name: string = attr.name;
            const value: string = attr.value;

            let values: String[] = value.split(';');
            let declarations: Declarations = {};
            let addLineStart: number = 0;
            const selector = node.tagName;
            const selectorLocation = node.sourceCodeLocation;
            const location = node.sourceCodeLocation?.attrs['style'];
            for (let i = 0; i < values.length - 1; i++) {
              const decPair: string[] = values[i].trim().split(':');
              const addLineEnd: number = decPair[0].length + decPair[1].length;
              declarations[decPair[0]] = {
                value: decPair[1],
                startLine: location?.startLine,
                endLine: location?.endLine,
                startColumn: location?.startCol + addLineStart,
                endColumn: location?.endCol + addLineEnd,
              };
              addLineStart += addLineEnd + 1;
            }
            cache.styles = {};
            cache.styles![selector] = {
              declarations: declarations,
              startLine: selectorLocation.startLine,
              endLine: selectorLocation.endLine,
              startColumn: selectorLocation.startCol,
              endColumn: selectorLocation.endCol,
            };
          }
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

      if (node.sourceCodeLocation) {
        cache.location = {
          startLine: node.sourceCodeLocation.startLine,
          startCol: node.sourceCodeLocation.startCol,
          endLine: node.sourceCodeLocation.endLine,
          endCol: node.sourceCodeLocation.endCol,
        };
      }
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
  console.log(htmlElements);
  return htmlRules(htmlElements, filePath);
}
