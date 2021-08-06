import * as concurrently from 'concurrently';

export async function executeParallellPackageJsonScripts(
  scripts: string[],
  packageJsonScripts: NcliNode.Scripts,
  directory: string
): Promise<void> {
  const invalidScripts = scripts
    .filter((script) => !(script in packageJsonScripts))
    .join(', ');

  if (invalidScripts.length > 0) {
    throw Error(`Scripts not found: ${invalidScripts}`);
  }

  const concurrentlyArgs = scripts.map((script) => `npm:${script}`);

  await concurrently(concurrentlyArgs, {
    cwd: directory
  });
}
