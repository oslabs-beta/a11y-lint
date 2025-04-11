import { Issue } from '../types/issue';
import { CssSelectorObj } from '../types/css';
import postcss from 'postcss';
import scss from 'postcss-scss';

export function parseSCSS (code: string, filePath: string): Issue [] {
    const root = scss.parse(code, { from: filePath });
    console.log(root);
    return [];
}