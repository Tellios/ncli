import { exit, stdin, stdout } from 'process';
import { PassThrough } from 'stream';
import { ParallelProcesses } from '../../common/process';
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

  const pp = new ParallelProcesses(
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

  const runPromise = pp.run({
    stdout: terminalPassthrough
  });

  const onStdinData = async (data: Buffer) => {
    const input = data.toString();

    if (input === '\u0003' || input === '\u0004') {
      // ctrl + c or ctrl + d

      console.log('Stopping processes...');
      await pp.exit();
      exit(0);
    } else if (input === '\u000C') {
      // ctrl + l
      enableTerminalOutput = false;

      const indices = await selectItems({
        items: scripts,
        message: 'Select streams to follow'
      });

      // Reset stdin after selectItems due to conflicts
      // with inquirer's readline
      stdin.setRawMode(true);
      stdin.setEncoding('utf-8');
      stdin.resume();

      const selectedScripts = indices.map((index) => scripts[index]);

      pp.filterStreams(selectedScripts);

      enableTerminalOutput = true;
    }
  };

  stdin.on('data', onStdinData);
  stdin.setRawMode(true);
  stdin.setEncoding('utf-8');
  stdin.resume();

  await runPromise;
}
