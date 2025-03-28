export interface Declaration {
  value: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface Declarations {
  [property: string]: Declaration;
}

export interface SelectorBlock {
  declarations: Declarations;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface CssSelectorObj {
  [selector: string]: SelectorBlock;
}
