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
