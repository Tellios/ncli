import {
  executePackageJsonScript,
  executeParallellPackageJsonScripts,
} from '../utils/index.ts';

export async function runScripts(
  scriptsToRun: string[],
  packageJson: NcliNode.PackageJson,
  directory: string,
): Promise<void> {
  if (scriptsToRun.length === 1) {
    const script = scriptsToRun[0];
    await executePackageJsonScript(script, packageJson.scripts, directory);
  } else {
    await executeParallellPackageJsonScripts(
      scriptsToRun,
      packageJson.scripts,
      directory,
    );
  }
}
