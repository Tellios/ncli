import { runCmdInConsole } from '../../common/index.ts';
import type { Scripts } from '../types.ts';
import { detectPackageManagerOrUseDefault } from './detect-package-manager.ts';

export async function executePackageJsonScript(
  script: string,
  availableScripts: Scripts,
  directory: string
): Promise<void> {
  if (Object.hasOwn(availableScripts, script)) {
    const packageManager = await detectPackageManagerOrUseDefault(directory);
    await runCmdInConsole(packageManager, ['run', script], true, directory);
  } else {
    throw new Error(`Script '${script}' not found in package.json`);
  }
}
