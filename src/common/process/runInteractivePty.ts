import * as pty from 'node-pty';
import { buildInteractiveShellCommand } from './runInteractiveCommand';

export interface IInteractivePtyResult {
  exitCode: number;
  failed: boolean;
  stdout: string;
  stderr: string;
  command: string;
  escapedCommand: string;
  failedMessage: string;
  timedOut: boolean;
  isCanceled: boolean;
  killed: boolean;
}

export interface IInteractivePtyRun {
  term: pty.IPty;
  completed: Promise<IInteractivePtyResult>;
}

export const startInteractivePty = (
  shellCommand: string,
  workingDirectory: string,
  env: NodeJS.ProcessEnv
): IInteractivePtyRun => {
  const shell = env.SHELL || '/bin/bash';
  const command = buildInteractiveShellCommand(shellCommand, workingDirectory);
  const cols = process.stdout.columns || 80;
  const rows = process.stdout.rows || 24;

  const term = pty.spawn(shell, ['-lc', command], {
    name: process.env.TERM || 'xterm-256color',
    cols,
    rows,
    cwd: workingDirectory,
    env: env as Record<string, string>
  });

  const stdinWasRaw = Boolean(
    process.stdin.isTTY &&
      (process.stdin as NodeJS.ReadStream & { isRaw?: boolean }).isRaw
  );

  const onStdin = (data: Buffer): void => {
    term.write(data.toString('utf-8'));
  };

  const onResize = (): void => {
    term.resize(process.stdout.columns || cols, process.stdout.rows || rows);
  };

  const onSigint = (): void => {
    term.write('\u0003');
  };

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', onStdin);
  }

  if (process.stdout.isTTY) {
    process.stdout.on('resize', onResize);
  }

  process.on('SIGINT', onSigint);
  const removeSigintListener = (): void => {
    process.off('SIGINT', onSigint);
  };

  term.onData((data) => {
    process.stdout.write(data);
  });

  const completed = new Promise<IInteractivePtyResult>((resolve) => {
    term.onExit(({ exitCode }) => {
      cleanup();

      const code = exitCode ?? 1;

      resolve({
        exitCode: code,
        failed: code !== 0,
        stdout: '',
        stderr: '',
        command,
        escapedCommand: command,
        failedMessage:
          code === 0 ? '' : `Command failed with exit code ${code}`,
        timedOut: false,
        isCanceled: false,
        killed: false
      });
    });
  });

  const cleanup = (): void => {
    removeSigintListener?.();

    if (process.stdout.isTTY) {
      process.stdout.off('resize', onResize);
    }

    if (process.stdin.isTTY) {
      process.stdin.off('data', onStdin);
      process.stdin.setRawMode(stdinWasRaw);
      process.stdin.pause();
    }
  };

  return { term, completed };
};
