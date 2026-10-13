export function validateScript(script: string): boolean | string {
  return script.length === 0 ? "Script can't be empty" : true;
}
