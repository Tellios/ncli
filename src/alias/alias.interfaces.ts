export interface IAliasesConfig {
  aliases: IAlias[];
}

export type AliasType = 'parallel' | 'sequential';

export interface IAlias {
  name: string;
  type?: AliasType;
  cmd: string | string[] | IAliasTask[];
  description?: string;
  workingDirectory?: string;
}

export interface IAliasTask {
  type?: AliasType;
  name: string;
  cmd: string | string[];
  workingDirectory?: string;
}

export const isAliasTask = (cmd: unknown): cmd is IAliasTask =>
  typeof cmd !== 'string';

export interface ICommand {
  commandText: string;
  positionalArguments: string[];
}

export type ExecutionPlan = IExecutionStep[];

export interface IExecutionStep {
  type: AliasType;
  name?: string;
  commands: ICommand[];
  workingDirectory?: string;
}
