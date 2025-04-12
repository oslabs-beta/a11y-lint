import { Issue } from '../types/issue';
import { CssSelectorObj } from '../types/css';
import postcss from 'postcss';
import scss from 'postcss-scss';

export function parseSCSS (code: string, filePath: string): Issue [] {
    const root = scss.parse(code, { from: filePath });
    console.log(root);
    const selectors: string[] = []
    const outputObj: CssSelectorObj = {};
    for (let node of root.nodes) {
        if (node.type === 'rule') {
            selectors.push(
            outputObj[node.selector] = {
                declarations: {},
                startLine: source.start.line,
                startColumn: source.start.column,
                endLine: source.end.line,
                endColumn: source.end.column,
            };
        )
    }
}
    for ()
}