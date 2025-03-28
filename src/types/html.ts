export type HtmlExtractedNode= {
    type: string;
    attributes: {
      [k: string]: { value: String;   location?: {
        startLine: number;
        startCol: number;
        endLine: number;
        endCol: number;
      };};
    } 
    location?: {
      startLine: number;
      startCol: number;
      endLine: number;
      endCol: number;
    };
    value?: string;
  };