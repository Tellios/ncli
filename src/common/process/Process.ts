import { Stream, Writable } from 'stream';
import * as execa from 'execa';
import * as treeKill from 'tree-kill';

export interface IProcessOptions {
  name: string;
  executable: string;
  args: string[];
  workingDirectory?: string;
}

export interface IProcessRunOptions {
  stdio?: Stream;
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
  private killed = false;

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

    this.killed = false;

    const { executable, args, workingDirectory } = this.options;

    this.instance = execa(executable, args, {
      cwd: workingDirectory,
      stdin: 'ignore'
    });

    this.instance.stderr?.on('data', (data) => {
      stdout?.write(data);
    });

    this.instance.stdout?.on('data', (data) => {
      stdout?.write(data);
    });

    return await this.instance.catch((error) => {
      if (this.killed) {
        // If the process was killed an error will bubble up,
        // but we want to treat it as any other response since
        // it is expected.
        return error;
      }

      throw error;
    });
  }

  exit(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.instance) {
        this.killed = true;

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
