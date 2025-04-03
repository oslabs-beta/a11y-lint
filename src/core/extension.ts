// -----------------------------`
// FILE: src/core/extension.ts
// DESCRIPTION: Entry point for the VS Code extension. Registers the linter
// and connects it to VS Code's diagnostics system when a file is saved.
// -----------------------------

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as postcss from 'postcss';
import { lintDocument } from './linter';
import { toDiagnostics } from './diagnostic';
import { getAllDependents, getFilesForSelector } from './dependencyGraph';


//* HOW ARE THE REGULAR SELECTORS BEIGN SELECTED OR IS IT ONLY ID AND CLASS THAT IS SELECTED IN THIS? 
//this is for getting the selectors so we know what files need to be linted
// formats so (.btn:hover, #nav .link) is just .btn or #nav
function extractCssSelectors(code: string): string[] {
  //empty array that will hold an array of strings that are the selectors
  const selectors: string[] = [];
  //set root equal to parsed out stringified CSS into AST object
  const root = postcss.parse(code);
  //method walk Rules is built in method of postcss.  walk Rules in AST esetially goes to each node of a certain type which is "rules" and in this case rules are each tag or class or id (i.e. <button>, <h1>, .buttons, #btn) 
  root.walkRules((rule) => {
    rule.selector
    // split each rule by the a comma
      .split(',')
      //map elements and trim off whitespace, split the string by colon and only map the zero index (ex. button:focus will split button and focus and only grab button as a selector)
      .map((s) => s.trim().split(/\s|:/)[0])
      //interate over the new array that was just created. and if the selector starts with a "." or "#" indicating class or id push the selector into the selectors array 
      .forEach((sel) => {
        if (sel.startsWith('.') || sel.startsWith('#')) {
          selectors.push(sel);
        }
      });
  });

  return selectors;
}

//* AM I CRAZY OR IS LINE 52 TO 62 DOING THE SAME THING AS 107 TO 114
//* THIS FUNCTION IS CALLED IN ACTIVATE FUNCTION
//here we are going to lint every file so we get all of our dependencies mapped out
//this way we dont have to save a file in a correct order to get the maps
async function preloadAllFiles(diagnostics: vscode.DiagnosticCollection) {
  //vscode method that creates and array or objects that finds files with the following file types
  const files = await vscode.workspace.findFiles(
    '**/*.{js,jsx,ts,tsx,html,css}',
    '**/node_modules/**'
  );
  //console.log(`🗂 Preloading ${files.length} files...`);
  //iterate through the the array of files
  for (const file of files) {
    //filePath is equal to file converted to a string 
    const filePath = file.fsPath;
    try {
      //issues is equal to out lintDocument function passing in the string filepath
      const issues = lintDocument(filePath);
      //result is equal to the the implimentations of the toDiagnostics function passing in the issues array
      const result = toDiagnostics(issues);
      // attaching the result array (issues) to the filepath and adding that to the diagnostics object (this object populates the problems tab and addes squiggly lines)
      diagnostics.set(vscode.Uri.file(filePath), result);
    } catch (err) {
      console.warn(`⚠️ Failed to parse ${filePath}`, err);
    }
  }

  //console.log('✅ Finished preloading dependency graph');
}

export async function activate(context: vscode.ExtensionContext) {
  //message to let us know the lionter has spun up
  vscode.window.showInformationMessage('🔥 A11YLint activated!');

  const diagnostics = vscode.languages.createDiagnosticCollection('a11ylint');
  //fucntion referenced on line 45 preloading of all files
  await preloadAllFiles(diagnostics);

  //event lsitener that is listening for onsave essentially.  Also when extention is turned off or deactived this will delete allt he diagnostics so they arent saved in memory
  context.subscriptions.push(
    //when file you are on is saved run this function and pass in the current document(file) you are on
    vscode.workspace.onDidSaveTextDocument((document) => {
      //file path is equal to the name of the file you are currently on
      const filePath = document.fileName;
      //console.log(`📁 Saved file: ${filePath}`);
      //we create a set and add the current file being saved
      const allToLint = new Set<string>();
      allToLint.add(filePath);

      //* below function can be found in dependecyGraph.ts file
      //first we get the dependents of the file and add them to our set
      getAllDependents(filePath).forEach((dep) => allToLint.add(dep));
      //then console log out what we are going to lint
      // console.log(
      //   '🔗 File-based dependents:',
      //   Array.from(getAllDependents(filePath))
      // );

      // step 2: if its a CSS file relint all files using its selectors
      // at some point we need to work on the nested components and stuff
      if (filePath.endsWith('.css')) {
        const code = fs.readFileSync(filePath, 'utf-8');
        const selectors = extractCssSelectors(code);
        //console.log('🎯 Extracted selectors:', selectors);

        for (const selector of selectors) {
          const files = getFilesForSelector(selector);
          files.forEach((f) => allToLint.add(f));
        }
      }
      //console.log('🌀 Re-linting these files:', Array.from(allToLint));

      // step 3: relint all affected files and update diagnostics
      for (const file of allToLint) {
        try {
          console.log(`🚨 Linting file: ${file}`);
          const issues = lintDocument(file);
          const result = toDiagnostics(issues);
          diagnostics.set(vscode.Uri.file(file), result);
        } catch (err) {
          console.error(`❌ Error linting ${file}:`, err);
        }
      }
    })
  );

  console.log('🥶 A11yLint is now active');
}

