import {runCmdInConsole} from '../../common/index.ts';
import {detectPackageManagerOrUseDefault} from './detectPackageManager.ts';

export async function executePackageJsonScript(
  script: string,
  availableScripts: NcliNode.Scripts,
  directory: string,
): Promise<void> {
  if (script in availableScripts) {
    const packageManager = await detectPackageManagerOrUseDefault(directory);
    await runCmdInConsole(packageManager, ['run', script], true, directory);
  } else {
    throw new Error(`Script '${script}' not found in package.json`);
  }
}
