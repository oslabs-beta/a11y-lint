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
