import * as path from 'path';
import * as fs from 'fs-extra';
import * as jsYaml from 'js-yaml';
import { getNcliDir } from '../../common';
import { IAliasesConfig } from '../alias.interfaces';

const configPath = path.join(getNcliDir(), 'alias.yml');

export const aliasFile = {
  getPath(): string {
    return configPath;
  },
  async exists(): Promise<boolean> {
    return await fs.pathExists(configPath);
  },
  async create(): Promise<void> {
    const aliasesConfig: IAliasesConfig = {
      aliases: []
    };

    const data = jsYaml.dump(aliasesConfig);

    await fs.outputFile(configPath, data, { encoding: 'utf-8' });
  },
  async read(): Promise<IAliasesConfig | undefined> {
    const config = await fs.readFile(configPath, 'utf8');
    return jsYaml.safeLoad(config) as IAliasesConfig | undefined;
  }
};
