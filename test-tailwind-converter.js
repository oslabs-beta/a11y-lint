import path from "path";
import { convert } from "@jyotirmay/tailwind-to-css";
import { isValidTailwindClass } from'@jyotirmay/tailwind-class-validator';

// const __dirname = path.resolve();

// process.chdir(path.resolve(__dirname));

console.log('CWD: ', process.cwd());

const input = `<div class="relative"></div>`;
convert(input).then(result => console.log(result));