import { styleText } from 'node:util';
import { type PersistedSetting } from '../../common/index.ts';

export const getPrintableSettings = (settings: PersistedSetting[]): string[] =>
  settings.map(({ key, value, workingDirectory }) => {
    const keyToPrint = styleText('cyanBright', key);
    const valueToPrint = styleText('greenBright', String(value));

    return `${keyToPrint} (${workingDirectory ?? 'Global'}): ${valueToPrint}`;
  });
