import { exit, stdin, stdout } from 'process';
import { PassThrough } from 'stream';
// import * as concurrently from 'concurrently';
import { ParalellProcesses } from '../../common/process';
import { selectItems } from '../../common/console';

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

  const pp = new ParalellProcesses(
    scripts.map((script) => ({
      name: script,
      executable: 'npm',
      args: ['run', script],
      workingDirectory: directory
    }))
  );

  let enableTerminalOutput = true;

  const terminalPassthrough = new PassThrough();
  terminalPassthrough.on('data', (data) => {
    if (enableTerminalOutput) {
      stdout.write(data);
    }
  });

  const aggregatedPromise = pp.run({
    stdout: terminalPassthrough
  });

  stdin.setRawMode(true);
  stdin.setEncoding('utf-8');
  stdin.on('data', async (data) => {
    const input = (data as unknown) as string;

    if (input === '\u0003' || input === '\u0004') {
      // ctrl + c or ctrl + d

      console.log('Stopping processes...');
      pp.exit();
      await aggregatedPromise;

      exit(0);
    } else if (input === '\u000C') {
      // ctrl + l
      enableTerminalOutput = false;

      const indices = await selectItems({
        items: scripts,
        message: 'Select streams to follow'
      });

      const selectedScripts = indices.map((index) => scripts[index]);

      pp.filterStreams(selectedScripts);
      stdin.resume();

      enableTerminalOutput = true;
    }
  });
  stdin.resume();
}
