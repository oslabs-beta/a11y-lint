export function splitSelector(selector: string): string[] {
  return selector
    .split(',') // handle multiple selectors
    .flatMap(
      (sel) =>
        sel
          .trim()
          .split(/\s+/) // handle descendant combinators
          .map((s) => s.split(':')[0]) // remove pseudoclasses
    )
    .filter(Boolean);
}
