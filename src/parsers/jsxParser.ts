// -----------------------------
// FILE: src/parsers/jsxParser.ts
// DESCRIPTION: Uses Babel to parse JSX/TSX files and applies JSX-specific rules.
// -----------------------------

// import * as jsx from 'acorn-jsx';
let jsx = require('acorn-jsx');
import * as acorn from 'acorn';

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

// let JSXParser = acorn.Parser.extend(jsx());
// const ast = JSXParser.parse(code, { ecmaVersion: 'latest' });

const code =
  '()=>(<div><p>Hello world</p><img src="url" altId="an image"/></div>)';

const ast = parse(code, { plugins: ['jsx'] });

// console.log(ast.body[0].expression.body.openingElement.name.name);
// console.log(ast.body[0].expression.body.children[1].openingElement.attributes);
// console.log(ast);

let depth = 0;
let prevNode;
let results = [];

traverse(ast, {
  enter(path) {
    // console.log(`enter ${path.type}(${path.key})`);
    // console.log(path.node);
    if (path.node.type === 'JSXAttribute') {
      // console.log('name: ' + path.node.name.name);
      // console.log('value: ' + path.node.value.value);
      results[results.length - 1].attributes.push({
        name: path.node.name.name,
        value: path.node.value.value,
      });
    } else if (
      path.node.type === 'JSXIdentifier' &&
      prevNode.type !== 'JSXAttribute'
    ) {
      // console.log(path.node.name);
      // console.log(path.node.loc);
      results.push({
        type: path.node.name,
        location: path.node.loc,
        attributes: [],
      });
    } else if (path.node.type === 'JSXText') {
      // console.log(path.node.value);
      results[results.length - 1].attributes.push({
        name: 'text',
        value: path.node.value,
      });
    }
    prevNode = path.node;
    console.log(results);
    // depth++;
  },
  exit(path) {
    depth--;
    // console.log(`  exit ${path.type}(${path.key})`);
  },
});

export function parseJSX(code: string, filePath: string) {
  // TODO: Use @babel/parser + jsxRules
  return [];
}
