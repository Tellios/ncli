import type { Scripts } from '../types.ts';

export function searchScripts(pattern: RegExp, scripts: Scripts): Scripts {
  const result: Scripts = {};

  for (const script in scripts) {
    if (Object.hasOwn(scripts, script) && pattern.test(script)) {
      result[script] = scripts[script];
    }
  }

  return result;
}
