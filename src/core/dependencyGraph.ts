import * as path from 'path';
import { SelectorBlock } from '../types/css';

//dependecy graph will be an object 
const dependencyGraph = new Map<string, Set<string>>();

// i guess we have to normalize file paths to avoid mismatch errors ?????
const normalize = (p: string) => path.resolve(p);

// when a file imports another one this would be called
export function addDependency(fromFile: string, toFile: string) {
  const dependent = normalize(fromFile);
  const dependency = normalize(toFile);

  if (!dependencyGraph.has(dependency)) {
    dependencyGraph.set(dependency, new Set());
  }

  dependencyGraph.get(dependency)!.add(dependent);
}

// when file is saved it gets files tht depend on it
export function getAllDependents(targetFile: string): Set<string> {
  const normalizedTarget = path.resolve(targetFile);
  const result = new Set<string>();

  for (const [dependency, dependents] of dependencyGraph.entries()) {
    if (dependency === normalizedTarget) {
      for (const dependent of dependents) {
        result.add(dependent);
      }
    }
  }

  return result;
}

export function getDependencies(filePath: string): Set<string> {
  const normalizedPath = path.resolve(filePath);
  const result = new Set<string>();

  for (const [dependency, dependents] of dependencyGraph.entries()) {
    if (dependents.has(normalizedPath)) {
      result.add(dependency);
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

// Selector Dependency Graph
// Tracks classes and ids

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

/*
 * Get all files related to a selector
 * files that use the selector or define it
 */
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
