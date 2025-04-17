import * as path from 'path';
import { SelectorBlock } from '../types/css';

//dependecy graph will be an object where the keys are strings(filepathes) and the values are a set of strings that reprent the files that depend on that file
const dependencyGraph = new Map<string, Set<string>>();

// i guess we have to normalize file paths to avoid mismatch errors ?????
const normalize = (p: string) => path.resolve(p);

// when a file imports another one this would be called fromFile is the file you are on that is doing the importing, toFile is the file being imported
export function addDependency(fromFile: string, toFile: string) {
  //dependent is the file doing the importing
  const dependent = normalize(fromFile);
  //dependency is the file being imported
  const dependency = normalize(toFile);
// run a check to see if the dependency graph doesnt have the filepath of the file you are currentyl on
  if (!dependencyGraph.has(dependency)) {
    //if it doesnt have the filepath then it will add the filepath as a key(dependecy) and a new Set as its value
    dependencyGraph.set(dependency, new Set());
  }
  //this is going to add to the dependency graph dependency as a key and have dependent be the value
  dependencyGraph.get(dependency)!.add(dependent);
}

//* this is the function that is being called in activate function
// when file is saved this file will get all the files that depend on it.
export function getAllDependents(targetFile: string): Set<string> {
  //normalizedTarget is going resolve the paths to avoid mismatch file errors
  const normalizedTarget = path.resolve(targetFile);
  //result will be an object of file paths
  const result = new Set<string>();
//  iterate over the dependecy graph key value pairs
  for (const [dependency, dependents] of dependencyGraph.entries()) {
    //if the file being imported (dependancy) is equal to the passed in file (normalizedTarget)
    if (dependency === normalizedTarget) {
      //then iterate over all the elements of the denpendents
      for (const dependent of dependents) {
        //add those dependents to the result object
        result.add(dependent);
      }
    }
  }

  return result;
}

// logs whole dependencyGraph
export function logDependencyGraph() {
  console.log('🚀 A11Y Dependency Graph:\n');
  for (const [dependency, dependents] of dependencyGraph.entries()) {
    const fromFiles = [...dependents].map((f) => `- ${f}).join('\n'`);
    console.log(`${dependency} is depended on by:\n${fromFiles}\n`);
  }
}

//Class-Tag Graph
//tracks which HTML tags classes/IDs are associated with
const classTagGraph = new Map<string, string>();

export function addClassTagPair(className: string, tag: string): void{
  if (!classTagGraph.has(className)){
    classTagGraph.set(className, tag)
  }
};

export function getClassTagPair(className: string): string | undefined{

  let results = undefined;

  if (classTagGraph.get(className)){
    results = classTagGraph.get(className);
  }
  return results;
}

// Selector Dependency Graph Tracks classes and ids and their assosiated files.  the key is the slector and the value is the file
const selectorGraph = new Map<string, Set<string>>();


/*
 * Track where a id or class is used
 * selector - CSS selector
 * filePath - the file where it's used (jsx or html)
 */
export function addSelectorUsage(selector: string, filePath: string) {
  const file = normalize(filePath);

  if (!selectorGraph.has(selector)) {
    selectorGraph.set(selector, new Set());
  }

  selectorGraph.get(selector)!.add(file);
}

/*
 * Track where a selector is defined
 * selector - CSS selector
 * filePath -  CSS file where it's defined
 */
export function addSelectorDefinition(selector: string, filePath: string) {
  const file = normalize(filePath);

  if (!selectorGraph.has(selector)) {
    selectorGraph.set(selector, new Set());
  }

  selectorGraph.get(selector)!.add(file);
}

//Get all files related to a selector that use the selector or define it. Checking which files use the selector.
export function getFilesForSelector(selector: string): Set<string> {
  return selectorGraph.get(selector) || new Set();
}

/*
 * Selector Style Registry - Stores declarations
 */
const selectorDeclarations = new Map<string, SelectorBlock>();

// Save a selector's style declarations (used for HTML/JSX linking)
export function registerSelectorDeclarations(
  selector: string,
  declarations: SelectorBlock
) {
  selectorDeclarations.set(selector, declarations);
}

// Retrieve a selector's declarations
export function getSelectorDeclarations(
  selector: string
): SelectorBlock | undefined {
  return selectorDeclarations.get(selector);
}
