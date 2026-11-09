import {
  executePackageJsonScript,
  executeParallellPackageJsonScripts
} from '../utils/index.ts';
import type { PackageJson } from '../types.ts';

export async function runScripts(
  scriptsToRun: string[],
  packageJson: PackageJson,
  directory: string,
  runInParallel = false
): Promise<void> {
  const invalidScripts = scriptsToRun.filter(
    (script) => !Object.hasOwn(packageJson.scripts, script)
  );

  if (invalidScripts.length > 0) {
    throw new Error(`Scripts not found: ${invalidScripts.join(', ')}`);
  }

  if (runInParallel && scriptsToRun.length > 1) {
    await executeParallellPackageJsonScripts(
      scriptsToRun,
      packageJson.scripts,
      directory
    );
    return;
  }

  for (const script of scriptsToRun) {
    await executePackageJsonScript(script, packageJson.scripts, directory);
  }
}
