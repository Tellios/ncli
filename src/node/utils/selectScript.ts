import {selectItem} from '../../common/index.ts';

export async function selectScript(
  availableScripts: NcliNode.Scripts,
  preSelectedScript?: string,
): Promise<string> {
  const scriptNames = Object.keys(availableScripts);
  const selectedIndex = await selectItem(
    scriptNames,
    'Select script',
    preSelectedScript,
  );

  return scriptNames[selectedIndex];
}
