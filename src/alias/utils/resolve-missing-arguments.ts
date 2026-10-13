import { cloneDeep } from 'lodash';
import { inputString } from '../../common/index.ts';
import { type ExecutionPlan } from '../alias.interfaces.ts';
import { type UserArguments } from './parse-user-arguments.ts';
import { builtInArguments } from './built-in-arguments.ts';

export const resolveMissingArguments = async (
  plan: ExecutionPlan,
  userArguments: UserArguments
): Promise<UserArguments> => {
  const newUserArguments = cloneDeep(userArguments);

  const commands = plan.flatMap((step) =>
    step.commands.map((c) => c.commandText)
  );

  const requestedPositionalArguments = await getMissingPositionalArguments(
    commands,
    userArguments
  );

  const requestedNamedArguments = await getMissingNamedArguments(
    commands,
    userArguments
  );

  newUserArguments.named = {
    ...newUserArguments.named,
    ...requestedNamedArguments
  };
  newUserArguments.positional = [
    ...newUserArguments.positional,
    ...requestedPositionalArguments
  ];

  return newUserArguments;
};

const getMissingNamedArguments = async (
  commands: string[],
  userArguments: UserArguments
): Promise<Record<string, string>> => {
  const namedArguments = getNamedArgumentsFromCommands(commands);
  const missingNamedArguments = getNamedArgumentsMissingInUserArguments(
    userArguments,
    namedArguments
  );
  return requestMissingNamedArguments(missingNamedArguments);
};

const getMissingPositionalArguments = async (
  commands: string[],
  userArguments: UserArguments
): Promise<string[]> => {
  const positionalArguments = getPositionalArgumentsFromCommands(commands);
  const missingPositionalArguments =
    getPositionalArgumentsMissingInUserArguments(
      userArguments,
      positionalArguments
    );

  return requestMissingPositionalArguments(missingPositionalArguments);
};

const getNamedArgumentsFromCommands = (commands: string[]): string[] =>
  getUniqueMatches(commands, /\$\{([a-z])*\}/giv).map(extractArgumentName);

const getPositionalArgumentsFromCommands = (commands: string[]): string[] =>
  getUniqueMatches(commands, /\$\d+/gv)
    .map((a) => a.slice(1))
    .toSorted();

const getUniqueMatches = (commands: string[], pattern: RegExp): string[] => [
  ...new Set(commands.flatMap((c) => c.match(pattern) ?? []))
];

const extractArgumentName = (argument: string): string => argument.slice(2, -1);

const getNamedArgumentsMissingInUserArguments = (
  userArguments: UserArguments,
  expectedArguments: string[]
): string[] =>
  expectedArguments.filter(
    (commandArgument) =>
      !Object.hasOwn(userArguments.named, commandArgument) &&
      !builtInArguments.includes(commandArgument)
  );

const getPositionalArgumentsMissingInUserArguments = (
  userArguments: UserArguments,
  expectedArguments: string[]
): string[] => {
  const missingArgumentCount = Math.abs(
    userArguments.positional.length - expectedArguments.length
  );

  return expectedArguments.slice(
    expectedArguments.length - missingArgumentCount
  );
};

const requestMissingNamedArguments = async (
  missingArguments: string[]
): Promise<Record<string, string>> => {
  const requestedArguments: Record<string, string> = {};

  for (const missingArgument of missingArguments) {
    requestedArguments[missingArgument] =
      await requestArgumentUsingConsole(missingArgument);
  }

  return requestedArguments;
};

const requestMissingPositionalArguments = async (
  missingPositionalArguments: string[]
): Promise<string[]> => {
  const requestedArguments: string[] = await Array.fromAsync(
    missingPositionalArguments,
    async (positionalArgument) =>
      requestArgumentUsingConsole(`Positional ${positionalArgument}`)
  );
  return requestedArguments;
};

const requestArgumentUsingConsole = async (argument: string): Promise<string> =>
  inputString(argument, (input) => {
    if (/\s/v.test(input)) {
      return "Parameter can't contain whitespace";
    }

    return input.length === 0 ? "Parameter can't be empty" : true;
  });
