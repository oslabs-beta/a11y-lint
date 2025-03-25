//need this for the individual declarations
export interface CSSDeclaration {
  value: string;
  start: { line: number; column: number };
  end: { line: number; column: number };
}
//need this for the entire parsed CSS
export interface ParsedCSS {
  [selector: string]: {
    [property: string]: CSSDeclaration;
  };
}
