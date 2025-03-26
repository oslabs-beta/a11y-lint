export type HtmlExtractedNode= {
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