import {type Stream, type Writable} from 'node:stream';
import execa from 'execa';
import treeKill from 'tree-kill';
import {green} from 'chalk';
import type pty from 'node-pty';
import {startInteractivePty} from './run-interactive-pty.ts';

export type ProcessOptions = {
  name: string;
  executable: string;
  args: string[];
  workingDirectory?: string;
  interactive?: boolean;
  /**
	Full command line for interactive PTY/shell spawn (yarn, jest, etc.)
	*/
  shellCommand?: string;
};

export type ProcessRunOptions = {
  stdin?: Stream;
  stdout?: Writable;
};

export type ProcessResult = {
  exitCode: number | undefined;
  failed: boolean;
  canceled: boolean;
};

export class Process {
  public readonly options: Required<ProcessOptions>;
  private instance: execa.ExecaChildProcess | undefined = null;
  private ptyProcess: pty.IPty | undefined = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onData: (data: Buffer) => void = () => {};
  private isExiting = false;
  private isOutputEnabled = true;

  constructor(options: ProcessOptions) {
    this.options = {
      interactive: false,
      shellCommand: '',
      ...options,
      workingDirectory: options.workingDirectory ?? process.cwd(),
    };
  }

  async run({stdout}: ProcessRunOptions): Promise<execa.ExecaReturnValue> {
    if (this.instance) {
      throw new Error(`Process '${this.options.name}' is already running`);
    }

    this.isExiting = false;

    const {executable, args, workingDirectory, interactive, shellCommand} =
      this.options;

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      // If the process uses colors we want to make sure to propagate
      // those as well
      FORCE_COLOR: 'true',
    };

    if (interactive) {
      delete env.CI;
    }

    if (interactive && shellCommand) {
      const {term, completed} = startInteractivePty(
        shellCommand,
        workingDirectory,
        env,
      );

      this.ptyProcess = term;

      return completed.finally(() => {
        this.ptyProcess = null;
      });
    }

    if (interactive) {
      this.instance = execa(executable, args, {
        cwd: workingDirectory,
        stdio: 'inherit',
        env,
        detached: process.platform !== 'win32',
      });
    } else {
      this.instance = execa(executable, args, {
        cwd: workingDirectory,
        stdin: 'ignore',
        env,
      });
    }

    let removeSigintListener: (() => void) | undefined;

    if (interactive) {
      const onSigint = (): void => {
        if (this.instance?.pid) {
          treeKill(this.instance.pid, 'SIGINT');
        }
      };

      process.on('SIGINT', onSigint);
      removeSigintListener = () => process.off('SIGINT', onSigint);
    }

    this.onData = (data: Buffer) => {
      this.isOutputEnabled && stdout?.write(data);
    };

    if (!interactive && stdout) {
      this.instance.stderr?.on('data', this.onData);
      this.instance.stdout?.on('data', this.onData);
    }

    return this.instance
      .then((result) => {
        if (!interactive && stdout) {
          stdout.write(green('Process finished successfully\n'));
        }

        return result;
      })
      .catch((error) => {
        if (this.isExiting) {
          // If the process was killed an error will bubble up,
          // but we want to treat it as any other response since
          // it is expected.
          return error;
        }

        if (interactive && error.exitCode != null) {
          return error;
        }

        throw error;
      })
      .finally(() => {
        removeSigintListener?.();
        this.instance?.stderr?.off('data', this.onData);
        this.instance?.stdout?.off('data', this.onData);
      });
  }

  resumeOutput(): void {
    this.isOutputEnabled = true;
  }

  pauseOutput(): void {
    this.isOutputEnabled = false;
  }

  async exit(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ptyProcess) {
        this.isExiting = true;
        this.ptyProcess.kill();
        this.ptyProcess = null;
        resolve();
        return;
      }

      if (this.instance) {
        this.isExiting = true;

        this.instance?.stderr?.off('data', this.onData);
        this.instance?.stdout?.off('data', this.onData);

        // Simply doing instance.cancel on some processes, like
        // NPM run scripts for example, does not properly stop
        // it. tree-kill on the other hand handles this
        // flawlessly.
        treeKill(this.instance?.pid, (error) => {
          if (error) {
            console.error(
              `Failed to kill process: ${this.options.name}`,
              error,
            );
            reject(error);
            return;
          }

          resolve();
        });
      }

      resolve();
    });
  }
}
