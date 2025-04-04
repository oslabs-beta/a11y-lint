import { CssSelectorObj } from './css';

export type HtmlExtractedNode = {
  type: string;
  attributes: {
    [k: string]: {
      value: String;
      location?: {
        startLine: number;
        startColumn: number;
        endLine: number;
        endColumn: number;
      };
    };
  };
  location?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
  value?: string;
  styles?: CssSelectorObj;
};

export interface MyTreeNode {
  nodeName: string;
  tagName?: string;
  attrs?: { name: string; value: string }[];
  childNodes?: MyTreeNode[];
  content?: MyTreeNode;
  parentNode?: MyTreeNode; // optional if you’re adding this
  value?: string; // for text nodes
  sourceCodeLocation?: {
    attrs?: any;
    startLine: number;
    endLine: number;
    startCol: number;
    endCol: number;
    startOffset: number;
    endOffset: number;
    rndTag: any;
  };
}