export const validateScriptName =
  (availableScripts: NcliNode.Scripts) =>
  (name: string): boolean | string => {
    if (name.length === 0) {
      return "Name can't be empty";
    }

    if (/\s/.test(name)) {
      return "Name can't contain whitespace";
    }

    return name in availableScripts ? 'Script already exists' : true;
  };
