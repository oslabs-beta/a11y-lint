// -----------------------------
// FILE: src/parsers/jsxParser.ts
// DESCRIPTION: Uses Babel to parse JSX/TSX files and applies JSX-specific rules.
// -----------------------------

// step 3 - parses code and calls the rules
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

// let JSXParser = acorn.Parser.extend(jsx());
// const ast = JSXParser.parse(code, { ecmaVersion: 'latest' });

// console.log(ast.body[0].expression.body.openingElement.name.name);
// console.log(ast.body[0].expression.body.children[1].openingElement.attributes);
// console.log(ast);

type Node = {
  type: String;
  location: Location;
  attributes: Attribute;
};

type Location = {
  lineStart: number;
  lineEnd: number;
  colStart: number;
  colEnd: number;
};

// type Attribute = {
//   name: String;
//   value: String;
// };

type Attribute = {
  [k: string]: { value: String; location: Location };
};

let prevNodeType: String = '';
let results: Node[] = [];

const code = `()=>(
  <div>
  <p>Hello world</p>
  <img src="url" altId="an image"/>
  </div>)`;

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
      const value = String(path.node.value!.value);
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

// console.log(results[3].attributes.hasOwnProperty('altId'));
console.log(results);

export function parseJSX(code: string, filePath: string) {
  return [];
}
