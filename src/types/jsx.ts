type Node = {
  type: String;
  location: Location;
  attributes: Attribute[];
};

type Location = {
  lineStart: number;
  lineEnd: number;
  colStart: number;
  colEnd: number;
};

type Attribute = {
  name: String;
  value: String;
};

export { Node, Location, Attribute };
