import { parse } from 'parse5';
import { htmlRules } from '../rules/htmlRules';
import { Issue } from '../types/issue';
import { Location } from '../types/jsx';
import { HtmlExtractedNode } from '../types/html';
import { Declarations, CssSelectorObj } from '../types/css';
import { addSelectorUsage, addDependency, addClassTagPair } from '../core/dependencyGraph';
import { isTailwind } from '../core/dependencyGraph';
import { tailwindParser } from './tailwindParser';
// import { tailwindParser } from '../../../research/tailwindParser';
import path from 'path';
// -----------------------------
// Parses HTML string, extracts elements, applies rules
// -----------------------------
let tailwindIssues: Issue[] =[];

export function parseHTML(code: string, filePath: string): Issue[] {
  const document = parse(code, { sourceCodeLocationInfo: true });
  const extractElements = (
    node: any,
    output: HtmlExtractedNode[] = []
  ): HtmlExtractedNode[] => {
    const cache: Partial<HtmlExtractedNode> = {};

    tailwindIssues =[];

    if (node.tagName) {
      cache.type = node.tagName;

      const attributes: {
        [k: string]: {
          value: string;
          location?: {
            startLine: number;
            startColumn: number;
            endLine: number;
            endColumn: number;
          };
        };
      } = {};

      if (Array.isArray(node.attrs)) {
        for (const attr of node.attrs) {
          //tracking css selectors
          //tracking css selectors
          if (attr.name === 'class' && !isTailwind()) {
            const classNames = attr.value.split(/\s+/); //in case multiple
            classNames.forEach((cls: any) => {
              addSelectorUsage(`.${cls}`, filePath);
              addClassTagPair(`.${cls}`, node.tagName);
            });
          }
          if (attr.name === 'class' && isTailwind()){
            //unfortunately you have to format code with the whole tag for the TW-to-CSS parser to work
            const codeString: string = String(attr.value);
            const location: Location = node.sourceCodeLocation?.attrs['class'];
            console.log('here is what we are feeding to the tailwind parser: ');
            console.log(codeString)
            tailwindParser(String(codeString), node.tagName, location, tailwindIssues).then((results) => {
              tailwindIssues = results;
            });
            console.log('new tailwindIssues: ', tailwindIssues);
          }
          //tracking id selectors
          if (attr.name === `id`) {
            addSelectorUsage(`#${attr.value}`, filePath);
            addClassTagPair(`#${attr.value}`, node.tagName);
          }

          if (attr.name !== 'style') {
            attributes[attr.name] = { value: attr.value };
          } else {
            const name: string = attr.name;
            const value: string = attr.value;

            let values: String[] = value.split(';');
            let declarations: Declarations = {};
            let addLineStart: number = 7;
            const selector = node.tagName;
            const selectorLocation = node.sourceCodeLocation;
            const location = node.sourceCodeLocation?.attrs['style'];
            console.log('style declarations locations: ', location);
            for (let i = 0; i < values.length - 1; i++) {
              const decPair: string[] = values[i].trim().split(':');
              const addLineEnd: number = decPair[0].length + decPair[1].length;
              declarations[decPair[0]] = {
                value: decPair[1],
                startLine: location?.startLine,
                endLine: location?.endLine,
                startColumn: location?.startCol + addLineStart,
                endColumn: location?.startCol + addLineStart + addLineEnd,
              };
              addLineStart += addLineEnd + 3;
            }
            cache.styles = {};
            cache.styles![selector] = {
              declarations: declarations,
              startLine: selectorLocation.lineStart,
              endLine: selectorLocation.lineEnd,
              startColumn: selectorLocation.colStart,
              endColumn: selectorLocation.colEnd,
            };
          }
        }
      }
      // Track file dependencies
      if (
        cache.type === 'link' &&
        attributes['rel']?.value === 'stylesheet' &&
        attributes['href']
      ) {
        const href = attributes['href'].value;
        const linkedFile = path.resolve(path.dirname(filePath), href);
        addDependency(filePath, linkedFile);
      }


      if (cache.type === 'script' && attributes['src']) {
        const src = attributes['src'].value;
        const linkedFile = path.resolve(path.dirname(filePath), src);
        addDependency(filePath, linkedFile);
      }
      const attrLocs = node.sourceCodeLocation?.attrs;
      if (attrLocs) {
        for (const attrName in attrLocs) {
          if (attrLocs && attributes[attrName]) {
            attributes[attrName].location = {
              startLine: attrLocs[attrName].startLine,
              startColumn: attrLocs[attrName].startCol,
              endLine: attrLocs[attrName].endLine,
              endColumn: attrLocs[attrName].endCol,
            };
          }
        }
      }

      cache.attributes = attributes;

      if (node.sourceCodeLocation) {
        cache.location = {
          startLine: node.sourceCodeLocation.startLine,
          startColumn: node.sourceCodeLocation.startCol,
          endLine: node.sourceCodeLocation.endLine,
          endColumn: node.sourceCodeLocation.endCol,
        };
      }
    }
    if (Object.keys(cache).length > 1) {
      output.push(cache as HtmlExtractedNode);
    }
    // Recursively visit child nodes
    if (node.childNodes) {
      for (const child of node.childNodes) {
        if (child.value && child.value.charAt(0) !== '\n') {
          cache.value = child.value;
        }
        extractElements(child, output);
      }
    }
    
    return output;
  };

  const htmlElements = extractElements(document);
  console.log(htmlElements);
  return htmlRules(htmlElements, filePath).concat(tailwindIssues);
}
