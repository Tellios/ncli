import process from 'node:process';
import type Buffer from 'node:buffer';
import pty from 'node-pty';
import { buildInteractiveShellCommand } from './run-interactive-command.ts';

export type InteractivePtyResult = {
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
};

export type InteractivePtyRun = {
  term: pty.IPty;
  completed: Promise<InteractivePtyResult>;
};

// Stdout columns/rows are typed as number but are undefined when not a TTY
const sizeOr = (value: number | undefined, fallback: number): number =>
  typeof value === 'number' && value > 0 ? value : fallback;

export const startInteractivePty = (
  shellCommand: string,
  workingDirectory: string,
  env: NodeJS.ProcessEnv
): InteractivePtyRun => {
  const shell = env.SHELL ?? '/bin/bash';
  const command = buildInteractiveShellCommand(shellCommand, workingDirectory);
  const cols = sizeOr(process.stdout.columns, 80);
  const rows = sizeOr(process.stdout.rows, 24);

  const term = pty.spawn(shell, ['-lc', command], {
    name: process.env.TERM ?? 'xterm-256color',
    cols,
    rows,
    cwd: workingDirectory,
    env
  });

  const isStdinWasRaw =
    process.stdin.isTTY &&
    (process.stdin as NodeJS.ReadStream & { isRaw?: boolean }).isRaw;

  const onStdin = (data: Buffer): void => {
    term.write(data.toString('utf8'));
  };

  const onResize = (): void => {
    term.resize(
      sizeOr(process.stdout.columns, cols),
      sizeOr(process.stdout.rows, rows)
    );
  };

  const onSigint = (): void => {
    term.write('\u{3}');
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

  const completed = new Promise<InteractivePtyResult>((resolve) => {
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

    if (!process.stdin.isTTY) {
      return;
    }

    process.stdin.off('data', onStdin);
    process.stdin.setRawMode(isStdinWasRaw);
    process.stdin.pause();
  };

  return { term, completed };
};
