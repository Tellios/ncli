import path from 'node:path';
import fs from 'fs-extra';
import jsYaml from 'js-yaml';
import { getNcliDir } from '../../common/index.ts';
import { type AliasesConfig } from '../alias.interfaces.ts';

const configPath = path.join(getNcliDir(), 'alias.yml');

export const aliasFile = {
  getPath(): string {
    return configPath;
  },
  async exists(): Promise<boolean> {
    return fs.pathExists(configPath);
  },
  async create(): Promise<void> {
    const aliasesConfig: AliasesConfig = {
      aliases: []
    };

    const data = jsYaml.dump(aliasesConfig);

    await fs.outputFile(configPath, data, { encoding: 'utf8' });
  },
  async read(): Promise<AliasesConfig | undefined> {
    const config = await fs.readFile(configPath, 'utf8');
    return jsYaml.safeLoad(config) as AliasesConfig | undefined;
  }
};
