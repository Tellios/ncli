import { PassThrough } from 'stream';
import { IProcessOptions, IProcessRunOptions, Process } from './Process';
import { cyan } from 'chalk';
import * as execa from 'execa';

export class ParallelProcesses {
  private processes: Process[];
  private streamFilter: string[] = [];

  constructor(private readonly processOptions: IProcessOptions[]) {
    this.processes = this.processOptions.map((options) => new Process(options));
  }

  async run({
    stdout
  }: IProcessRunOptions): Promise<execa.ExecaReturnValue<string>[]> {
    const instances = this.processes.map((process) => {
      const stream = new PassThrough();
      stream.on('data', (data) => {
        if (
          this.streamFilter.length === 0 ||
          this.streamFilter.includes(process.options.name)
        ) {
          stdout?.write(`[${cyan(process.options.name)}] ${data.toString()}`);
        }
      });

      return process.run({ stdout: stream });
    });

    return await Promise.all(instances);
  }

  exit(): Promise<void[]> {
    return Promise.all(
      this.processes.map((process, index) => {
        console.log(`Stopping process ${this.processOptions[index].name}`);
        process.exit();
      })
    );
  }

  filterStreams(scriptNames: string[]): void {
    this.streamFilter = scriptNames;
  }
}
