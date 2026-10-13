import { selectItem } from '../../common/index.ts';
import type { Scripts } from '../types.ts';

export async function selectScript(
  availableScripts: Scripts,
  preSelectedScript?: string
): Promise<string> {
  const scriptNames = Object.keys(availableScripts);
  const selectedIndex = await selectItem(
    scriptNames,
    'Select script',
    preSelectedScript
  );

  return scriptNames[selectedIndex];
}
