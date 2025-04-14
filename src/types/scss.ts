export interface Variable{
    [variable: string]: string
}

export interface SCSSDeclaration {
    value: string | Variable;
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  }
  
  export interface SCSSDeclarations {
    [property: string]: SCSSDeclaration;
  }
  
  export interface SCSSSelectorBlock {
    declarations: SCSSDeclarations;
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  }

  export interface SCSSSelectorObj {
    [selector: string]: SCSSSelectorBlock;
  }
