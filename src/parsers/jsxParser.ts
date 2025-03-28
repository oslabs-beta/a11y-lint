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

const testCode = `()=>(
  <div>
  <p>Hello world</p>
  <a href="url2"></a>
  <input type='text'/>
  <table>
  <tr>
  <td>This is in my table</td>
  </tr>
  </table>
  <img src="url"/>
  </div>)`;

// const parsedTest = parseJSX(testCode, '');

// console.log(parseJSX(testCode, ''));

//TODO: need to differentiate between opening and closing JSX elements
export function parseJSX(code: string, filePath: string): Issue[] {
  let prevNodeType: String = '';
  let results: Node[] = [];
  const ast = parse(code, { plugins: ['jsx'] });
  traverse(ast, {
    enter(path) {
      // console.log(`enter ${path.type}(${path.key})`);
      // console.log(path.node);
      if (path.node.type === 'JSXAttribute') {
        // console.log('name: ' + path.node.name.name);
        // console.log('value: ' + path.node.value.value);
        // console.log(path.node.loc);
        const name = String(path.node.name.name);
        const value = String(path.node.value!.value).toLowerCase();
        // results[results.length - 1].attributes.push({
        //   name: String(path.node.name.name),
        //   value: path.node.value!.value,
        // });
        results[results.length - 1].attributes[name] = {
          value: value,
          location: {
            lineStart: Number(path.node.loc?.start.line),
            lineEnd: Number(path.node.loc?.end.line),
            colStart: Number(path.node.loc?.start.column),
            colEnd: Number(path.node.loc?.end.column),
          },
        };
      } else if (
        //should we update this to just be JSXOpeningElement? do we want closing elements too?
        path.node.type === 'JSXOpeningElement' ||
        path.node.type === 'JSXClosingElement'
      ) {
        // console.log(path.node.name);
        // console.log(path.node.loc);
        results.push({
          type: path.node.name.name,
          location: {
            lineStart: Number(path.node.loc?.start.line),
            lineEnd: Number(path.node.loc?.end.line),
            colStart: Number(path.node.loc?.start.column),
            colEnd: Number(path.node.loc?.end.column),
          },
          attributes: {},
        });
      } else if (
        path.node.type === 'JSXText' &&
        path.node.value.charAt(0) !== '\n'
      ) {
        // console.log(path.node.value);
        // const name = 'text';
        results[results.length - 1].value = String(path.node.value);
        // results[results.length - 1].attributes[name] = {
        //   value: value,
        //   location: {
        //     lineStart: Number(path.node.loc?.start.line),
        //     lineEnd: Number(path.node.loc?.end.line),
        //     colStart: Number(path.node.loc?.start.column),
        //     colEnd: Number(path.node.loc?.end.column),
        //   },
        // };
        // results[results.length - 1].attributes.push({
        //   name: 'text',
        //   value: path.node.value,
        // });
      }
      prevNodeType = path.node.type;
      // console.log(results);
    },
  });
  console.log(results);
  return jsxRules(results, filePath);
}
