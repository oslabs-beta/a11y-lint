// -----------------------------
// FILE: src/parsers/jsxParser.ts
// DESCRIPTION: Uses Babel to parse JSX/TSX files and applies JSX-specific rules.
// -----------------------------

// step 3 - parses code and calls the rules
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { Node } from '../types/jsx';
import { jsxRules } from '../rules/jsxRules';
import { Issue } from '../types/issue';
import { Declarations } from '../types/css';
import { addSelectorUsage, addDependency, addClassTagPair } from '../core/dependencyGraph';
import * as nodePath from 'path';


export function parseJSX(code: string, filePath: string): Issue[] {
  let prevNodeType: String = '';
  let results: Node[] = [];
  //translates the JSX code into an Abstract Syntax Tree
  const ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
  //traverses that tree
  traverse(ast, {
    enter(path) {
      //if a node is an attribute
      if (path.node.type === 'JSXAttribute') {
        const name = String(path.node.name.name);
        const value = String(path.node.value!.value).toLowerCase();
        if (results.length > 0) {
          //we want to check for className and ID markers so we can feed that info to our dependency graph
          if (name === 'className') {
            value.split(/\s+/).forEach((cls) => {
              addSelectorUsage(`.${cls}`, filePath);
              addClassTagPair(`.${cls}`, String(results[results.length - 1].type));
            });
          } else if (name === 'id') {
            addSelectorUsage(`#${value}`, filePath);
            addClassTagPair(`#${value}`, String(results[results.length - 1].type));
          }
          //we don't need to do anything special with non-"style" attributes, just store them in the last object in our array
          //(which will be the most recently parsed node)
          if (name !== 'style') {
            results[results.length - 1].attributes[name] = {
              value: value,
              location: {
                startLine: Number(path.node.loc?.start.line),
                endLine: Number(path.node.loc?.end.line),
                startColumn: Number(path.node.loc?.start.column),
                endColumn: Number(path.node.loc?.end.column),
              },
            };
          } else {
            //for "style" attributes, we need to parse them into CSS so we can run rules on them
            //to do this, we split the string along semi-colons
            let values: String[] = value.split(';');
            let declarations: Declarations = {};
            //starts 8 characters from the beginning of the style attribute, which accounts for the five letters, the equal sign, and the opening
            //quotation mark
            let addLineStart: number = 8;
            const selector: string = String(results[results.length - 1].type);
            const selectorLocation = results[results.length - 1].location;
            const location = path.node.loc;
            //this allows us to get declaration name and precise location info for each declaration in the style attribute
            for (let i = 0; i < values.length - 1; i++) {
              const decPair: string[] = values[i].trim().split(':');
              const addLineEnd: number = decPair[0].length + decPair[1].length;
              declarations[decPair[0]] = {
                value: decPair[1],
                startLine: location?.start.line!,
                endLine: location?.end.line!,
                startColumn: location?.start.column! + addLineStart,
                endColumn: location?.start.column! + addLineStart + addLineEnd,
              };
              addLineStart += addLineEnd + 3;
            }
            //and we add all that info to the "style" attribute on the node's result object
            results[results.length - 1].styles = {};
            results[results.length - 1].styles![selector] = {
              declarations: declarations,
              startLine: selectorLocation.startLine,
              endLine: selectorLocation.endLine,
              startColumn: selectorLocation.startColumn,
              endColumn: selectorLocation.endColumn,
            };
        }}}
        //this just stores the tag name and location for each JSX element in our output array
       else if (
        path.node.type === 'JSXOpeningElement'
      ) {
        results.push({
          type: path.node.name.name,
          location: {
            startLine: Number(path.node.loc?.start.line),
            endLine: Number(path.node.loc?.end.line),
            startColumn: Number(path.node.loc?.start.column) + 1,
            endColumn: Number(path.node.loc?.end.column),
          },
          attributes: {},
        });
        //text is stored as the value of whatever node it belongs to
      } else if (
        path.node.type === 'JSXText' &&
        path.node.value.charAt(0) !== '\n'
      ) {
        results[results.length - 1].value = String(path.node.value);
        results[results.length-1].location.endLine = path.node.loc?.end.line || 0;
        results[results.length-1].location.endColumn = path.node.loc?.end.column || 0;

        //adding file dependency
      } else if (path.node.type === 'ImportDeclaration') {
        const importPath = path.node.source.value;
        const resolvedPath = nodePath.resolve(
          nodePath.dirname(filePath),
          importPath
        );
        addDependency(filePath, resolvedPath);
      }

      prevNodeType = path.node.type;
    },
  });
  return jsxRules(results, filePath);
}
