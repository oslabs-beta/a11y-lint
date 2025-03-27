// -----------------------------
// FILE: src/rules/jsxRules.ts
// DESCRIPTION: Contains accessibility rules specific to JSX files, such as missing alt
// attributes or improper ARIA roles.
// -----------------------------

import { Issue } from '../types/issue';
import { Node } from '../types/jsx';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export function jsxRules(parsedJsx: Node[], file: string): Issue[] {
  const issues: Issue[] = [];
  for (let i = 0; i < parsedJsx.length; i++) {
    //if our node is an img tag
    if (parsedJsx[i].type === 'img') {
      //check if it has any attributes at all
      if (!parsedJsx[i].attributes.hasOwnProperty('alt')) {
        //if not, push a missing altId issue
        issues.push({
          file,
          line: parsedJsx[i].location.lineStart,
          column: parsedJsx[i].location.colStart,
          endLine: parsedJsx[i].location.lineEnd,
          endColumn: parsedJsx[i].location.colEnd,
          message: `Images should have alt ID.`,
          fix: 'Please add "alt" attribute. Decorative/nonfunctional images may use empty string as alt ID.',
          severity: 'warning',
        });
      }
    } else if (
      parsedJsx[i].type === 'a' &&
      !parsedJsx[i].attributes.hasOwnProperty('text') &&
      parsedJsx[i].attributes.hasOwnProperty('href')
    ) {
      issues.push({
        file,
        line: parsedJsx[i].location.lineStart,
        column: parsedJsx[i].location.colStart - 1,
        endLine: parsedJsx[i].location.lineEnd,
        endColumn: parsedJsx[i].location.colEnd + 1,
        message: `Links should have clear descriptive text.`,
        fix: 'Please add text between <a> tags that describes the purpose of link.',
        severity: 'warning',
      });
    }
    //EXTENSION: check the htmlFor for each label and find its corresponding input
    else if (
      parsedJsx[i].type === 'input' &&
      parsedJsx[i - 1].type !== 'label'
    ) {
      issues.push({
        file,
        line: parsedJsx[i].location.lineStart,
        column: parsedJsx[i].location.colStart,
        endLine: parsedJsx[i].location.lineEnd,
        endColumn: parsedJsx[i].location.colEnd,
        message: `Input fields should be labeled.`,
        fix: 'Please add a label tag. Use "htmlFor" attribute to assign label to the specific input it marks.',
        severity: 'warning',
      });
    }
    //EXTENSION: this would check if there is a th tag for each td tag in a set of tr tags
    else if (
      parsedJsx[i].type === 'table' &&
      parsedJsx[i + 2].type !== 'th' &&
      parsedJsx[i - 1].type !== 'tr'
    ) {
      issues.push({
        file,
        line: parsedJsx[i].location.lineStart,
        column: parsedJsx[i].location.colStart,
        endLine: parsedJsx[i].location.lineEnd,
        endColumn: parsedJsx[i].location.colEnd,
        message: `Tables should have clearly labeled headers.`,
        fix: 'Please add a descriptive <th> tag for each column of the table.',
        severity: 'warning',
      });
    }
  }
  return issues;
}

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

const parsedTest = parseJSX(testCode, '');
console.log(parsedTest);

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
        path.node.type === 'JSXIdentifier' &&
        prevNodeType !== 'JSXAttribute'
      ) {
        // console.log(path.node.name);
        // console.log(path.node.loc);
        results.push({
          type: path.node.name,
          location: {
            lineStart: Number(path.node.loc?.start.line),
            lineEnd: Number(path.node.loc?.end.line),
            colStart: Number(path.node.loc?.start.column),
            colEnd: Number(path.node.loc?.end.column),
          },
          attributes: {},
        });
      } else if (path.node.type === 'JSXText' && path.node.value !== '\n  ') {
        // console.log(path.node.value);
        const name = 'text';
        const value = String(path.node.value);
        results[results.length - 1].attributes[name] = {
          value: value,
          location: {
            lineStart: Number(path.node.loc?.start.line),
            lineEnd: Number(path.node.loc?.end.line),
            colStart: Number(path.node.loc?.start.column),
            colEnd: Number(path.node.loc?.end.column),
          },
        };
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
