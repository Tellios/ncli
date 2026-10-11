import { runCmdInConsole } from '../../common';
import { detectPackageManagerOrUseDefault } from './detectPackageManager';

export async function executePackageJsonScript(
  script: string,
  availableScripts: NcliNode.Scripts,
  directory: string
): Promise<void> {
  if (script in availableScripts) {
    const packageManager = await detectPackageManagerOrUseDefault(directory);
    await runCmdInConsole(packageManager, ['run', script], true, directory);
  } else {
    throw Error(`Script '${script}' not found in package.json`);
  }
}
