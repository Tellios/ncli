import type { Scripts } from '../types.ts';

export const validateScriptName =
  (availableScripts: Scripts) =>
  (name: string): boolean | string => {
    if (name.length === 0) {
      return "Name can't be empty";
    }

    if (/\s/v.test(name)) {
      return "Name can't contain whitespace";
    }

    return Object.hasOwn(availableScripts, name)
      ? 'Script already exists'
      : true;
  };
