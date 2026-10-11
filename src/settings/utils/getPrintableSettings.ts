import chalk from 'chalk';
import {type IPersistedSetting} from '../../common/index.ts';

export const getPrintableSettings = (settings: IPersistedSetting[]): string[] =>
  settings.map(({key, value, workingDirectory}) => {
    const keyToPrint = chalk.cyanBright(key);
    const valueToPrint = chalk.greenBright(value);

    return `${keyToPrint} (${workingDirectory ?? 'Global'}): ${valueToPrint}`;
  });
