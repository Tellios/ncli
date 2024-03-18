import * as execa from 'execa';
import { ExecaError } from 'execa';
import { CmdError } from './CmdError';

function isExecaError(error: any): error is ExecaError {
  return error.exitCode != null;
}

export async function runCmdInConsole(
  cmd: string,
  args: string[],
  inheritStdio = true,
  cwd: string | undefined = undefined
): Promise<void> {
  try {
    await execa(cmd, args, {
      stdio: inheritStdio ? 'inherit' : undefined,
      cwd
    });
  } catch (error) {
    if (isExecaError(error)) {
      throw new CmdError(
        error.exitCode,
        error.message,
        error.stdout,
        'Command failed'
      );
    }

    throw new Error('Command failed with an unknown error');
  }
}
