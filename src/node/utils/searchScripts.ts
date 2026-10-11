export function searchScripts(
  pattern: RegExp,
  scripts: NcliNode.Scripts,
): NcliNode.Scripts {
  const result: NcliNode.Scripts = {};

  for (const script in scripts) {
    if (script in scripts && pattern.test(script)) {
      result[script] = scripts[script];
    }
  }

  return result;
}
