import { PassThrough } from 'stream';
import { IProcessOptions, IProcessRunOptions, Process } from './Process';
import { cyan, yellow, bold } from 'chalk';
import * as execa from 'execa';

export class ParallelProcesses {
  private processes: Process[];

  constructor(private readonly processOptions: IProcessOptions[]) {
    this.processes = this.processOptions.map((options) => new Process(options));
  }

  async run({
    stdout
  }: IProcessRunOptions): Promise<execa.ExecaReturnValue<string>[]> {
    const instances = this.processes.map((process) => {
      const onData = (data: Buffer) => {
        stdout?.write(
          `${this.getProcessPrefix(process)} ${data.toString('utf-8')}`
        );
      };

      const stream = new PassThrough();
      stream.on('data', onData);

      return process.run({ stdout: stream }).finally(() => {
        stream.off('data', onData);
        stream.destroy();
      });
    });

    return Promise.all(instances);
  }

  exit(): Promise<void[]> {
    return Promise.all(
      this.processes.map((process) => {
        console.log(
          `${this.getProcessPrefix(process)} ${yellow('Stopping process')}`
        );
        return process.exit();
      })
    );
  }

  filterStreams(scriptNames: string[]): void {
    this.processes.forEach((process) => {
      if (scriptNames.length === 0) {
        process.resumeOutput();
      } else if (scriptNames.includes(process.options.name)) {
        process.resumeOutput();
      } else {
        process.pauseOutput();
      }
    });
  }

  private getProcessPrefix(process: Process) {
    return [
      bold(yellow('[')),
      bold(cyan(process.options.name)),
      bold(yellow(']'))
    ].join('');
  }
}
