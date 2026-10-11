import path from 'node:path';
import os from 'node:os';

export const getNcliDir = (): string => path.join(os.homedir(), '.ncli');
