import { ConsoleInterface, colorizeCommand } from '../../common/index.ts';
import type { Scripts } from '../types.ts';

export function listPackageJsonScripts(availableScripts: Scripts): void {
  const scriptsTable = Object.entries(availableScripts).map(
    ([script, value]) => [script, colorizeCommand(value)]
  );

  ConsoleInterface.printTable(['Script', 'Command'], scriptsTable);
}
