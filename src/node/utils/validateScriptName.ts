export const validateScriptName =
  (availableScripts: NcliNode.Scripts) =>
  (name: string): boolean | string => {
    if (name.length === 0) {
      return `Name can't be empty`;
    } else if (/\s/g.test(name)) {
      return `Name can't contain whitespace`;
    } else if (name in availableScripts) {
      return `Script already exists`;
    }

    return true;
  };
