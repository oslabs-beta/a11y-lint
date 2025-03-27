export interface declarations {
  [key: string]: {
    value: string;
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

export interface cssSelectorObj {
  [key: string]: declarations;
}
