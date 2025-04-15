import { CssSelectorObj } from "../types/css";
import { Issue } from "../types/issue";
import { Location } from "../types/jsx";
import { convert } from "./converter.js";
import { addClassTagPair } from "../core/dependencyGraph";
import { cssRulesFromObject } from "../rules/cssRules";
import postcss from 'postcss';

//add back in: parentNodeTag: string, location: Location,
export async function tailwindParser(code: string, parentNodeTag: string, location: Location, issues: Issue[]): Promise<Issue[]> {
  const results: CssSelectorObj = {}
  convert(code).then((response)=>{
    const twToCSS = response;
    console.log('twToCSS code! ', twToCSS);
    const root = postcss.parse(twToCSS.css);
    const splitCode = code.split(' ');
    //get the lengths of each TW declaration for linting
    const values: number[] = [];
    for (let i = 1; i<splitCode.length;i++){
        if (splitCode[i].includes('=')){
            values[i] = splitCode[i].split('=')[1].length;
        }
        else if (splitCode[i].includes(':')){
            values[i] = splitCode[i].split(':')[1].length;
        }
        else{
            values[i] = splitCode[i].length;
        }
    } 

root.walkRules((rule) => {
    //selecting the spefici tag so I can set it equal to th key of the object
    const selector = rule.selector;
    console.log('tw parser selector: ', selector);
    //checking if the tag already exists in the object.  If it doesn't add it set it equal to a key with the value as an empty object
    if (!results[selector]) {
      results[selector] = {
        declarations: {},
        startLine: location.startLine,
        startColumn: location.startColumn,
        endLine: location.endLine,
        endColumn: location.endColumn,
      };
    }

    if (!selector.includes(':')){
        addClassTagPair(selector, parentNodeTag);
    }

    //this is how we're going to track which TW declaration we're on, to add appropriate lengths to location;
    let declNum: number = 1;
    let addColStart: number = code.split('=')[0].length + 2;
    let addColEnd: number = 0;
    //walkDecls is a method of postCSS that goes through each Declaration (attribute)
    rule.walkDecls((decl) => {
        // console.log('decl: ', decl);
        addColEnd = values[declNum];
        console.log('tw parser decl: ', decl);
      //setting the key equal to the prop and the values are all the info we want
      results[selector].declarations[decl.prop] = {
        value: decl.value,
        startLine: location.startLine,
        startColumn: location.startColumn + addColStart,
        endLine: location.endLine,
        endColumn: location.startColumn + addColStart + addColEnd,
      };

      addColStart += addColEnd + 2;
      declNum++;
    });
  });

  console.log('tailwind parser results! ', results);

  return cssRulesFromObject(results, '', issues);
  })
}

// const code = `<div class="relative overflow-hidden rounded-full bg-emerald-900/30 p-1 transition-all duration-300 group-hover:bg-emerald-800/40">`

// tailwindParser(code, 'a', {startLine: 0, startColumn: 0, endLine: 0, endColumn: 0}, []);