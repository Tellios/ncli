import { cloneDeep } from 'lodash';
import { inputString } from '../../common';
import { IUserArguments } from './parseUserArguments';
import { builtInArguments } from './builtInArguments';
import { IAlias } from '../alias.interfaces';

export const resolveMissingArguments = async (
  alias: IAlias,
  userArguments: IUserArguments
): Promise<IUserArguments> => {
  const commands = getAliasCommands(alias);

  const requestedPositionalArguments = await getMissingPositonalArguments(
    commands,
    userArguments
  );

  const requestedNamedArguments = await getMissingNamedArguments(
    commands,
    userArguments
  );

  const newUserArguments = cloneDeep(userArguments);
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

const getAliasCommands = (alias: IAlias): string[] => {
  return Array.isArray(alias.cmd) ? alias.cmd : [alias.cmd];
};

const getMissingNamedArguments = async (
  commands: string[],
  userArguments: IUserArguments
): Promise<Record<string, string>> => {
  const namedArguments = getNamedArgumentsFromCommands(commands);
  const missingNamedArguments = getNamedArgumentsMissingInUserArguments(
    userArguments,
    namedArguments
  );
  return await requestMissingNamedArguments(missingNamedArguments);
};

const getMissingPositonalArguments = async (
  commands: string[],
  userArguments: IUserArguments
): Promise<string[]> => {
  const positionalArguments = getPositionalArgumentsFromCommands(commands);
  const missingPositionalArguments = getPositionalArgumentsMissingInUserArguments(
    userArguments,
    positionalArguments
  );

  return await requestMissingPositionalArguments(missingPositionalArguments);
};

const getNamedArgumentsFromCommands = (commands: string[]): string[] => {
  return commands
    .map((c) => c.match(/\${([a-z])*}/gi))
    .reduce(appendArgumentIfUnique, [])
    .map(extractArgumentName);
};

const getPositionalArgumentsFromCommands = (commands: string[]): string[] => {
  return commands
    .map((c) => c.match(/\$\d+/gi))
    .reduce(appendArgumentIfUnique, [])
    .map((a) => a.substring(1))
    .sort();
};

const appendArgumentIfUnique = (
  acc: string[],
  current: RegExpMatchArray | null
): string[] => {
  current?.forEach((match) => {
    if (!acc.includes(match)) {
      acc.push(match);
    }
  });

  return acc;
};

const extractArgumentName = (argument: string): string =>
  argument.substring(2, argument.length - 1);

const getNamedArgumentsMissingInUserArguments = (
  userArguments: IUserArguments,
  expectedArguments: string[]
): string[] => {
  return expectedArguments.filter((commandArgument) => {
    return (
      !(commandArgument in userArguments.named) &&
      !builtInArguments.includes(commandArgument)
    );
  });
};

const getPositionalArgumentsMissingInUserArguments = (
  userArguments: IUserArguments,
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
    requestedArguments[missingArgument] = await requestArgumentUsingConsole(
      missingArgument
    );
  }

  return requestedArguments;
};

const requestMissingPositionalArguments = async (
  missingPositionalArguments: string[]
): Promise<string[]> => {
  const requestedArguments: string[] = [];

  for (const positionalArgument of missingPositionalArguments) {
    requestedArguments.push(
      await requestArgumentUsingConsole(`Positional ${positionalArgument}`)
    );
  }

  return requestedArguments;
};

const requestArgumentUsingConsole = async (
  argument: string
): Promise<string> => {
  return await inputString(argument, (input) => {
    if (/\s/g.test(input)) {
      return "Parameter can't contain whitespace";
    }

    if (input.length === 0) {
      return "Parameter can't be empty";
    }

    return true;
  });
};
