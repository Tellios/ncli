import { exit, stdin, stdout } from 'process';
import * as concurrently from 'concurrently';
import { ParalellProcesses } from '../../common/process';

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

  if (concurrentlyArgs.length < 0) {
    await concurrently(concurrentlyArgs, {
      cwd: directory
    });
  }

  stdin.setRawMode(true);
  stdin.setEncoding('utf-8');
  stdin.on('data', (data) => {
    const input = (data as unknown) as string;

    if (input === '\u0003' || input === '\u0004') {
      // ctrl + c or ctrl + d
      exit(0);
    } else if (input === '\u000C') {
      // ctrl + l
      console.log('filter');
    }
  });

  const pp = new ParalellProcesses();
  pp.run(
    scripts.map((script) => ({
      name: script,
      executable: 'npm',
      args: ['run', script],
      workingDirectory: directory
    })),
    {
      stdout
    }
  );
}
