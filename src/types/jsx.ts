import { CssSelectorObj } from './css';

type Node = {
  type: String;
  location: Location;
  attributes: Attribute;
  value?: String;
  styles?: CssSelectorObj;
};

type Location = {
  lineStart: number;
  lineEnd: number;
  colStart: number;
  colEnd: number;
};

type Attribute = {
  [k: string]: { value: String; location: Location };
};

export { Node, Location, Attribute };
