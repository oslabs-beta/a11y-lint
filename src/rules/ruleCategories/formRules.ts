import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const formRules: { [key: string]: Function } = {};

formRules.labelInputs = (parsedJsx: Node, previousNode: Node, issues: Issue[]): Issue[] => {
        //EXTENSION: check the htmlFor for each label and find its corresponding input
        if (previousNode.type !== 'label'){
        issues.push({
              line: parsedJsx.location.lineStart,
              column: parsedJsx.location.colStart,
              endLine: parsedJsx.location.lineEnd,
              endColumn: parsedJsx.location.colEnd,
              message: `Input fields should be labeled.`,
              fix: 'Please add a label tag. Use "htmlFor" attribute to assign label to the specific input it marks.',
              severity: 'warning',
            });}
          return issues;
}

export default formRules;