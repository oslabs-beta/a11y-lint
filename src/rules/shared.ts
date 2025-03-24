// -----------------------------
// FILE: src/rules/shared.ts
// DESCRIPTION: Utility functions shared across rule files, such as helpers to read
// node attributes.
// -----------------------------

export function getAttr(node: any, attr: string): string | undefined {
  const attrNode = node.attrs?.find((a: any) => a.name === attr);
  return attrNode?.value;
}
