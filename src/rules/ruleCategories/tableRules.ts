import { Issue } from "../../types/issue";
import { Node } from "../../types/jsx";

const tableRules: { [key: string]: Function } = {};

tableRules.usesCaption = (parsedSlice: Node[], issues: Issue[]): Issue[] => {
  if (parsedSlice[1].type !== "caption") {
    issues.push({
      line: parsedSlice[0].location.startLine,
      column: parsedSlice[0].location.startColumn,
      endLine: parsedSlice[0].location.startLine,
      endColumn: parsedSlice[0].location.startColumn+6,
      message: `Tables should have <caption> element to provide table title.`,
      fix: "Please add a descriptive <caption> tag on the first line after <table>. See WCAG 1.3.1: https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",
      severity: "warning",
    });
  } else if (!parsedSlice[1].value) {
    issues.push({
      line: parsedSlice[1].location.startLine,
      column: parsedSlice[1].location.startColumn,
      endLine: parsedSlice[1].location.endLine,
      endColumn: parsedSlice[1].location.endColumn,
      message: `Caption element requires text titling table.`,
      fix: "Please add a decriptive title between <caption> tags.",
      severity: "warning",
    });
  }
  return issues;
};

tableRules.hasHeaders = (
  parsedSlice: Node[],
  issues: Issue[]
): Issue[] => {
  let tdCount = 0;
  let thCount = 0;
  let i = 0;
  //traverses array to until we find the first data entry in the table
  while (i < parsedSlice.length && parsedSlice[i].type !== "td") {
    i++;
  }
  //counts how many entries there are in that cluster, should be consistent for each row
  while (i < parsedSlice.length && parsedSlice[i].type === "td") {
    tdCount++;
    //increment by two because there will be two td tags per entry: one opening and one closing
    i++;
  }
  //reset count so we can look for headers
  i = 0;

  while (i < parsedSlice.length && parsedSlice[i].type !== "th") {
    i++;
  }
  //now we'll count how many headers there are
  while (i < parsedSlice.length && parsedSlice[i].type === "th") {
    thCount++;

    //check to make sure each header has a scope attribute
    if (!parsedSlice[i].attributes.hasOwnProperty("scope")) {
      issues.push({
        line: parsedSlice[i].location.startLine,
        column: parsedSlice[i].location.startColumn,
        endLine: parsedSlice[i].location.endLine,
        endColumn: parsedSlice[i].location.endColumn,
        message: `Each header should have "scope" attribute.`,
        fix: 'Please add a "scope" attribute specifying whether a header cell is a header for a column, row, or group of columns or rows.',
        severity: "warning",
      });
    }

    i++;
  }

  if (tdCount > thCount) {
    issues.push({
      line: parsedSlice[0].location.startLine,
      column: parsedSlice[0].location.startColumn,
      endLine: parsedSlice[0].location.startLine,
      endColumn: parsedSlice[0].location.startColumn+6,
      message: `Tables should have clearly labeled headers.`,
      fix: "Please add a descriptive <th> tag for each column of the table.",
      severity: "warning",
    });
  }

  return issues;
};

export default tableRules;
