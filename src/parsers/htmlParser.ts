// -----------------------------
// FILE: src/parsers/htmlParser.ts
// DESCRIPTION: Uses parser to parse HTML files and applies HTML-specific rules.
// -----------------------------
const parse5 = require('parse5');
const fs = require('fs');

//point to the html file
const html = fs.readFileSync('../../index.html', 'utf-8');
//pass the html file to the parser
const document = parse5.parse(html, {sourceCodeLocationInfo:true})

type HtmlExtractedNode= {
  type: string;
  attributes: Record<string, string>; 
  location: {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
  };
  value?: string;
};



const extractElements = (
  node: any,
  output: HtmlExtractedNode[] = []
): HtmlExtractedNode[] => {
  const cache: Partial<HtmlExtractedNode> = {};

  if (node.tagName) {
    cache.type = node.tagName;
    cache.attributes = node.attrs || {};
    cache.location = {
      startLine: node.sourceCodeLocation.startLine,
      startCol: node.sourceCodeLocation.startCol,
      endLine: node.sourceCodeLocation.endLine,
      endCol: node.sourceCodeLocation.endCol,
    };
  }

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
console.log(htmlElements)