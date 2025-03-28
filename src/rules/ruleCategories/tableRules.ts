import { Issue } from '../../types/issue';
import { Node } from '../../types/jsx';

const tableRules: { [key: string]: Function } = {};

tableRules.hasHeaders = (parsedJsx: Node, previousNode: Node, secondNextNode: Node, issues: Issue[]): Issue[] => {
        //EXTENSION: this would check if there is a th tag for each td tag in a set of tr tags
           
        if (previousNode.type !== 'tr' && secondNextNode.type !== 'th')
        issues.push({
              line: parsedJsx.location.lineStart,
              column: parsedJsx.location.colStart,
              endLine: parsedJsx.location.lineEnd,
              endColumn: parsedJsx.location.colEnd,
              message: `Tables should have clearly labeled headers.`,
              fix: 'Please add a descriptive <th> tag for each column of the table.',
              severity: 'warning',
            });
          return issues;
}

export default tableRules;
