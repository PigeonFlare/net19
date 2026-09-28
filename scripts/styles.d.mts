export const SAFE_ATTRIBUTE: string;
export function isLayout(property: string, value: string): boolean;
export function compileTheme(css: string): string;
export function buildStyles(root: URL): Promise<void>;
