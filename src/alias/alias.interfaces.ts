export type IAliasesConfig = {
  aliases: IAlias[];
};

export type AliasType = 'parallel' | 'sequential';

export type IAlias = {
  name: string;
  type?: AliasType;
  cmd: string | string[] | IAliasTask[];
  description?: string;
  workingDirectory?: string;
  interactive?: boolean;
};

export type IAliasTask = {
  type?: AliasType;
  name: string;
  cmd: string | string[];
  workingDirectory?: string;
  interactive?: boolean;
};

export const isAliasTask = (cmd: unknown): cmd is IAliasTask =>
  typeof cmd !== 'string';

export type ICommand = {
  commandText: string;
  positionalArguments: string[];
};

export type ExecutionPlan = IExecutionStep[];

export type IExecutionStep = {
  type: AliasType;
  name?: string;
  commands: ICommand[];
  workingDirectory?: string;
  interactive?: boolean;
};
