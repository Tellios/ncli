import { exit, stdout } from 'process';
import { PassThrough } from 'stream';
import { ParallelProcesses } from '../../common/process';
import {
  selectItems,
  ShortcutListener,
  CommonShortcuts
} from '../../common/console';

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

  const shortcutListener = new ShortcutListener();

  const stopProcesses = async () => {
    await pp.exit();
    exit(0);
  };

  const filterOutput = async () => {
    enableTerminalOutput = false;

    shortcutListener.stop();

    const indices = await selectItems({
      items: scripts,
      message: 'Select streams to follow'
    });

    shortcutListener.start();

    const selectedScripts = indices.map((index) => scripts[index]);

    pp.filterStreams(selectedScripts);

    enableTerminalOutput = true;
  };

  shortcutListener.registerShortcut(CommonShortcuts.Ctrl_C, stopProcesses);
  shortcutListener.registerShortcut(CommonShortcuts.Ctrl_D, stopProcesses);
  shortcutListener.registerShortcut(CommonShortcuts.Ctrl_L, filterOutput);
  shortcutListener.start();

  await runPromise;

  terminalPassthrough.removeAllListeners();
  terminalPassthrough.destroy();
}
