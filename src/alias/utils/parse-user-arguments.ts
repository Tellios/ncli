export type UserArguments = {
  positional: string[];
  named: Record<string, string>;
  appended: string[];
};

export class UserArgumentParseError extends Error {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function parseUserArguments(userArgs: string[]): UserArguments {
  const parsedUserArgs: UserArguments = {
    positional: [],
    named: {},
    appended: []
  };
  let isAppendArgs = false;

  for (const arg of userArgs) {
    if (arg === '--') {
      isAppendArgs = true;
    } else if (isAppendArgs) {
      parsedUserArgs.appended.push(arg);
    } else if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=', 2);

      if (value === undefined) {
        throw new UserArgumentParseError(
          `'${key}' argument provided incorrectly. Named arguments must be supplied using the format '--key=value'.`
        );
      }

      parsedUserArgs.named[key] = value;
    } else {
      parsedUserArgs.positional.push(arg);
    }
  }

  return parsedUserArgs;
}
