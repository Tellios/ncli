import { execa, ExecaError } from 'execa';
import { CmdError } from './cmd-error.ts';

export async function runCmdInConsole(
  cmd: string,
  args: string[],
  inheritStdio = true,
  cwd?: string
): Promise<void> {
  try {
    await execa(cmd, args, {
      stdio: inheritStdio ? 'inherit' : undefined,
      cwd
    });
  } catch (error) {
    if (error instanceof ExecaError && error.exitCode !== undefined) {
      throw new CmdError(
        error.exitCode,
        error.message,
        error.stdout ?? '',
        'Command failed'
      );
    }

    throw new Error('Command failed with an unknown error', { cause: error });
  }
}
