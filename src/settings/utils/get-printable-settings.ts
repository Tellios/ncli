import chalk from 'chalk';
import {type PersistedSetting} from '../../common/index.ts';

export const getPrintableSettings = (settings: PersistedSetting[]): string[] =>
  settings.map(({key, value, workingDirectory}) => {
    const keyToPrint = chalk.cyanBright(key);
    const valueToPrint = chalk.greenBright(value);

    return `${keyToPrint} (${workingDirectory ?? 'Global'}): ${valueToPrint}`;
  });
