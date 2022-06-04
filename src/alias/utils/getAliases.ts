import { confirm, ConsoleInterface } from '../../common';
import { IAlias } from '../alias.interfaces';
import { validateAliases } from './validateAliases';
import { aliasFile } from './aliasFile';

export const getAliases = async (): Promise<IAlias[]> => {
  const exists = await aliasFile.exists();

  if (!exists) {
    if (await confirm('No alias file found, do you want to create it?')) {
      await aliasFile.create();
      ConsoleInterface.printLine(`File created at ${aliasFile.getPath()}`);

      process.exit(0);
    }

    throw Error(`No alias file found at: ${aliasFile.getPath()}`);
  }

  const doc = await aliasFile.read();

  if (!doc) {
    throw Error(
      'Failed to load yaml config, expected object but got undefined'
    );
  }

  return await validateAliases(doc.aliases);
};
