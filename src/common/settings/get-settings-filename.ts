import path from 'node:path';
import {getNcliDir} from '../paths/index.ts';

export const getSettingsFilename = (): string =>
  path.join(getNcliDir(), '.settings.json');
