import { Stream, Writable } from 'stream';
import * as execa from 'execa';
import * as treeKill from 'tree-kill';
import { green } from 'chalk';

export interface IProcessOptions {
  name: string;
  executable: string;
  args: string[];
  workingDirectory?: string;
}

export interface IProcessRunOptions {
  stdin?: Stream;
  stdout?: Writable;
}

export interface IProcessResult {
  exitCode: number | null;
  failed: boolean;
  canceled: boolean;
}

export class Process {
  public readonly options: Required<IProcessOptions>;
  private instance: execa.ExecaChildProcess | null = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onData: (data: Buffer) => void = () => {};
  private isExiting = false;
  private isOutputEnabled = true;

  constructor(options: IProcessOptions) {
    this.options = {
      workingDirectory: process.cwd(),
      ...options
    };
  }

  async run({ stdout }: IProcessRunOptions): Promise<execa.ExecaReturnValue> {
    if (this.instance) {
      throw Error(`Process '${this.options.name}' is already running`);
    }

    this.isExiting = false;

    const { executable, args, workingDirectory } = this.options;

    this.instance = execa(executable, args, {
      cwd: workingDirectory,
      stdin: 'ignore',
      env: {
        // If the process uses colors we want to make sure to propagate
        // those as well
        FORCE_COLOR: 'true'
      }
    });

    this.onData = (data: Buffer) => {
      this.isOutputEnabled && stdout && stdout.write(data);
    };

    if (stdout) {
      this.instance.stderr?.on('data', this.onData);
      this.instance.stdout?.on('data', this.onData);
    }

    return await this.instance
      .then((result) => {
        stdout && stdout.write(green(`Process finished successfully\n`));
        return result;
      })
      .catch((error) => {
        if (this.isExiting) {
          // If the process was killed an error will bubble up,
          // but we want to treat it as any other response since
          // it is expected.
          return error;
        }

        throw error;
      })
      .finally(() => {
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

  exit(): Promise<void> {
    return new Promise((resolve, reject) => {
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
              error
            );
            return reject(error);
          }

          resolve();
        });
      }

      resolve();
    });
  }
}
