import { ConsoleInterface } from '../../common';
import { aliasFile } from '../utils';

export const generateAliasFile = async (): Promise<void> => {
  if (await aliasFile.exists()) {
    throw new Error(`Alias file already exists at ${aliasFile.getPath()}`);
  }

  await aliasFile.create();
  ConsoleInterface.printLine(`Alias file created at ${aliasFile.getPath()}`);
};
