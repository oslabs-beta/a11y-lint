
export interface cssSelectorObj {
    [key: string]: {[key: string]: {
        value: string,
        startLine: number,
        startColumn: number,
        endLine: number,
        endColumn: number,
    }
}
}