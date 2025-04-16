// convert-tailwind-to-css.js

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// import fs from 'fs';
import postcss from 'postcss';
import tailwindcssPlugin from '@tailwindcss/postcss';

// Generated CSS indent spaces count
const indentSpaces = 2;
// Generated CSS output file
// const outputCSS = './output.css';

const code = "relative overflow-hidden rounded-full bg-emerald-900/30 p-1 transition-all duration-300 group-hover:bg-emerald-800/40";

// Load tailwind.config.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = resolve(__dirname, '../../tailwind.config.js');

export async function convert(code){
const css = `.cls{@apply ${code}}`;
// Convert Tailwind CSS to native CSS
postcss([ 
  tailwindcssPlugin(configPath)])
  // .process(css, {from: undefined})
  // .process('@tailwind utilities; @tailwind components;', { from: './src' })
  .process(
    `@layer theme, base, components, utilities;
    @import "tailwindcss/theme.css" layer(theme);
    /* preflight: Not required, it only creates rules for CSS reset. */
    /* @import "tailwindcss/preflight.css" layer(base); */
    @import "tailwindcss/utilities.css" layer(utilities);`, 
    {from: code})
  .then((result) => {
    // console.log('results: ', result);
    // Format and write the CSS output
    const formattedCSS = result.css
      .replaceAll(' '.repeat(4), ' '.repeat(indentSpaces)) // Handle indentation
      .replace(/([^{;\s]+:[^;}]+)(\s*?)\n(\s*})/g, '$1;\n$3'); // Insert semicolon before newline and closing brace, preserving indentation
      
    // fs.writeFileSync(outputCSS, formattedCSS, 'utf8');
    const root = postcss.parse(formattedCSS);
    const varRegex = /\-\-([[a-z-0-9]+)/g;
    const results = {};
    const cssVars = {};
    root.walkRules((rule) => {
      let selector = rule.selector;
      rule.walkDecls((decl) => {
        if(decl.prop.match(varRegex)){
          cssVars[decl.prop] = decl.value;
        }});})
    console.log('css vars object: ', cssVars);
    root.walkRules((rule) => {
      rule.walkDecls((decl) => {
          if(decl.prop.match(varRegex)){
            // console.log('moving on...');
          }
        else if (decl.value.match(varRegex)){
          const vars = decl.value.match(varRegex);
          let value = decl.value;
          vars.forEach((variable)=> {
            // results[decl.prop] = results[decl.prop] ? results[decl.prop] + ' ' + cssVars[variable] : cssVars[variable];
            const pattern = `v?a?r?\\(${variable}\\)?`
            const replaceable = new RegExp(pattern);
            value = value.replace(replaceable, cssVars[variable]);
            // console.log('value: ', value)
            // console.log('value.replace: ', value.replace(replaceable, cssVars[variable]));
          })
          if (!results[decl.prop]){
          results[decl.prop] = value;}
        }
        else{
          if (!results[decl.prop]){
        results[decl.prop] = decl.value;}}
      })

    });
    // console.log(`Native CSS generated: ${outputCSS}`);
    console.log('converter results: ', results);
    return results;
  })
  .catch((err) => console.error('An error occurred:', err));}