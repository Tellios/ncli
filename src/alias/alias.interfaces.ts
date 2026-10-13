export type AliasesConfig = {
  aliases: Alias[];
};

export type AliasType = 'parallel' | 'sequential';

export type Alias = {
  name: string;
  type?: AliasType;
  cmd: string | string[] | AliasTask[];
  description?: string;
  workingDirectory?: string;
  interactive?: boolean;
};

export type AliasTask = {
  type?: AliasType;
  name: string;
  cmd: string | string[];
  workingDirectory?: string;
  interactive?: boolean;
};

export const isAliasTask = (cmd: unknown): cmd is AliasTask =>
  typeof cmd !== 'string';

export type Command = {
  commandText: string;
  positionalArguments: string[];
};

export type ExecutionPlan = ExecutionStep[];

export type ExecutionStep = {
  type: AliasType;
  name?: string;
  commands: Command[];
  workingDirectory?: string;
  interactive?: boolean;
};
