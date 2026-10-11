import {confirm, ConsoleInterface} from '../../common/index.ts';
import {type IAlias} from '../alias.interfaces.ts';
import {validateAliases} from './validateAliases.ts';
import {aliasFile} from './aliasFile.ts';

export const getAliases = async (): Promise<IAlias[]> => {
  const isExists = await aliasFile.exists();

  if (!isExists) {
    if (await confirm('No alias file found, do you want to create it?')) {
      await aliasFile.create();
      ConsoleInterface.printLine(`File created at ${aliasFile.getPath()}`);

      process.exit(0);
    }

    throw new Error(`No alias file found at: ${aliasFile.getPath()}`);
  }

  const doc = await aliasFile.read();

  if (!doc) {
    throw new Error(
      'Failed to load yaml config, expected object but got undefined',
    );
  }

  return validateAliases(doc.aliases);
};
