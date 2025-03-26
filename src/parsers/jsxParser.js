"use strict";
// -----------------------------
// FILE: src/parsers/jsxParser.ts
// DESCRIPTION: Uses Babel to parse JSX/TSX files and applies JSX-specific rules.
// -----------------------------
exports.__esModule = true;
// import * as jsx from 'acorn-jsx';
var jsx = require('acorn-jsx');
var acorn = require("acorn");
var JSXParser = acorn.Parser.extend(jsx());
var code = '()=>(<div><p>Hello world</p><img/></div>)';
var ast = JSXParser.parse(code, { ecmaVersion: 'latest' });
console.log(ast.body[0]);
function parseJSX(code, filePath) {
    // TODO: Use @babel/parser + jsxRules
    return [];
}
exports.parseJSX = parseJSX;
