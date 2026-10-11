import {ConsoleInterface, colorizeCommand} from '../../common/index.ts';

export function listPackageJsonScripts(
  availableScripts: NcliNode.Scripts,
): void {
  const scriptsTable = Object.entries(availableScripts).map(
    ([script, value]) => [script, colorizeCommand(value)],
  );

  ConsoleInterface.printTable(['Script', 'Command'], scriptsTable);
}
