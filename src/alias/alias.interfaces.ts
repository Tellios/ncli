export interface IAliasesConfig {
  aliases: IAlias[];
}

export interface IAlias {
  name: string;
  cmd: string | string[];
  description?: string;
  workingDirectory?: string;
}

export interface ICommand {
  commandText: string;
  positionalArguments: string[];
}
