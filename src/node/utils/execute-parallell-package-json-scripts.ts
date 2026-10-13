import { exit, stdout } from 'node:process';
import { PassThrough } from 'node:stream';
import {
  type ProcessOptions,
  ParallelProcesses,
  selectItems,
  ShortcutListener,
  CommonShortcuts
} from '../../common/index.ts';
import type { Scripts } from '../types.ts';
import { detectPackageManagerOrUseDefault } from './detect-package-manager.ts';

export async function executeParallellPackageJsonScripts(
  scripts: string[],
  packageJsonScripts: Scripts,
  directory: string
): Promise<void> {
  const invalidScripts = scripts
    .filter((script) => !Object.hasOwn(packageJsonScripts, script))
    .join(', ');

  if (invalidScripts.length > 0) {
    throw new Error(`Scripts not found: ${invalidScripts}`);
  }

  const packageManager = await detectPackageManagerOrUseDefault(directory);

  const processOptions = scripts.map((script): ProcessOptions => ({
    name: script,
    executable: packageManager,
    args: ['run', script],
    workingDirectory: directory
  }));

  const pp = new ParallelProcesses(processOptions);

  let isEnableTerminalOutput = true;

  const terminalPassthrough = new PassThrough();
  terminalPassthrough.on('data', (data) => {
    if (isEnableTerminalOutput) {
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
    isEnableTerminalOutput = false;

    shortcutListener.stop();

    const indices = await selectItems({
      items: scripts,
      message: 'Select streams to follow'
    });

    shortcutListener.start();

    const selectedScripts = indices.map((index) => scripts[index]);

    pp.filterStreams(selectedScripts);

    isEnableTerminalOutput = true;
  };

  shortcutListener.registerShortcut(CommonShortcuts.Ctrl_C, stopProcesses);
  shortcutListener.registerShortcut(CommonShortcuts.Ctrl_D, stopProcesses);
  shortcutListener.registerShortcut(CommonShortcuts.Ctrl_L, filterOutput);
  shortcutListener.start();

  await runPromise;

  terminalPassthrough.removeAllListeners();
  terminalPassthrough.destroy();
}
