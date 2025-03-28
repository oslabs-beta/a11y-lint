import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const tableRules: { [key: string]: Function } = {};

tableRules.hasHeaders = (
  parsedJsx: Node,
  previousNode: Node,
  secondNextNode: Node,
  issues: Issue[]
): Issue[] => {
  //EXTENSION: this would check if there is a th tag for each td tag in a set of tr tags

  if (previousNode.type !== 'tr' && secondNextNode.type !== 'th') {
    issues.push({
      line: parsedJsx.location.lineStart,
      column: parsedJsx.location.colStart,
      endLine: parsedJsx.location.lineEnd,
      endColumn: parsedJsx.location.colEnd,
      message: `Tables should have clearly labeled headers.`,
      fix: 'Please add a descriptive <th> tag for each column of the table.',
      severity: 'warning',
    });
  }
  return issues;
};

tableRules.usesCaption = (parsedSlice: Node[], issues: Issue[]): Issue[] => {
  if (parsedSlice[1].type !== 'caption') {
    issues.push({
      line: parsedSlice[0].location.lineStart,
      column: parsedSlice[0].location.colStart,
      endLine: parsedSlice[0].location.lineEnd,
      endColumn: parsedSlice[0].location.colEnd,
      message: `Tables should have <caption> element to provide table title.`,
      fix: 'Please add a descriptive <caption> tag on the first line after <table>.',
      severity: 'warning',
    });
  } else if (!parsedSlice[1].value) {
    issues.push({
      line: parsedSlice[1].location.lineStart,
      column: parsedSlice[1].location.colStart,
      endLine: parsedSlice[1].location.lineEnd,
      endColumn: parsedSlice[1].location.colEnd,
      message: `Caption element requires text titling table.`,
      fix: 'Please add a decriptive title between <caption> tags.',
      severity: 'warning',
    });
  }
  return issues;
};

tableRules.hasHeadersBetter = (
  parsedSlice: Node[],
  issues: Issue[]
): Issue[] => {
  let tdCount = 0;
  let thCount = 0;
  let i = 0;
  //traverses array to until we find the first data entry in the table
  while (parsedSlice[i].type !== 'td') {
    i++;
  }
  //counts how many entries there are in that cluster, should be consistent for each row
  while (parsedSlice[i].type === 'td') {
    tdCount++;
    //increment by two because there will be two td tags per entry: one opening and one closing
    i += 2;
  }
  //reset count so we can look for headers
  i = 0;

  while (parsedSlice[i].type !== 'th' && i < parsedSlice.length - 1) {
    i++;
  }
  //now we'll count how many headers there are
  while (parsedSlice[i].type === 'th') {
    thCount++;

    //check to make sure each header has a scope attribute
    if (!parsedSlice[i].attributes.hasOwnProperty('scope')) {
      issues.push({
        line: parsedSlice[i].location.lineStart,
        column: parsedSlice[i].location.colStart,
        endLine: parsedSlice[i].location.lineEnd,
        endColumn: parsedSlice[i].location.colEnd,
        message: `Each header should have "scope" attribute.`,
        fix: 'Please add a "scope" attribute specifying whether a header cell is a header for a column, row, or group of columns or rows.',
        severity: 'warning',
      });
    }

    i += 2;
  }

  if (tdCount > thCount) {
    issues.push({
      line: parsedSlice[0].location.lineStart,
      column: parsedSlice[0].location.colStart,
      endLine: parsedSlice[0].location.lineEnd,
      endColumn: parsedSlice[0].location.colEnd,
      message: `Tables should have clearly labeled headers.`,
      fix: 'Please add a descriptive <th> tag for each column of the table.',
      severity: 'warning',
    });
  }

  return issues;
};

export default tableRules;
