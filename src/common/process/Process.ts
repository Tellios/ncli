import { Stream, Writable } from 'stream';
import * as execa from 'execa';

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
  private options: Required<IProcessOptions>;
  private instance: execa.ExecaChildProcess | null = null;

  constructor(options: IProcessOptions) {
    this.options = {
      workingDirectory: process.cwd(),
      ...options
    };
  }

  async run({ stdout }: IProcessRunOptions): Promise<execa.ExecaReturnValue> {
    const { executable, args, workingDirectory } = this.options;

    this.instance = execa(executable, args, {
      cwd: workingDirectory
    });

    this.instance.stdout?.on('data', (data) => console.log(data.toString()));

    return await this.instance;
  }

  exit(): void {
    this.instance?.cancel();
  }
}
