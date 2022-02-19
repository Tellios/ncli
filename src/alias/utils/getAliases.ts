import * as jsYaml from 'js-yaml';
import * as fse from 'fs-extra';
import * as path from 'path';
import { getNcliDir } from '../../common';
import { IAlias, IAliasesConfig } from '../alias.interfaces';
import { validateAliases } from './validateAliases';

export const getAliases = async (): Promise<IAlias[]> => {
  const configPath = path.join(getNcliDir(), 'alias.yml');

  if (fse.existsSync(configPath)) {
    const config = await fse.readFile(configPath, 'utf8');
    const doc: IAliasesConfig = jsYaml.safeLoad(config) as IAliasesConfig;

    if (!doc) {
      throw Error(
        'Failed to load yaml config, expected object but got undefined'
      );
    }

    return await validateAliases(doc.aliases);
  } else {
    throw Error(`No alias file found at: ${configPath}`);
  }
};
