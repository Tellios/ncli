import { IProcessOptions, IProcessRunOptions, Process } from './Process';
import * as execa from 'execa';
import { ProcessesBase } from './ProcessesBase';

export class ParallelProcesses extends ProcessesBase {
  protected readonly processes: ReadonlyArray<Process>;

  constructor(private readonly processOptions: IProcessOptions[]) {
    super();
    this.processes = this.processOptions.map((options) => new Process(options));
  }

  async run(
    options: IProcessRunOptions
  ): Promise<execa.ExecaReturnValue<string>[]> {
    const results: execa.ExecaReturnValue[] = [];

    const instances = this.processes.map(async (process) => {
      const result = await this.runProcess(process, options);
      result && results.push(result);
    });

    await Promise.allSettled(instances);

    return results;
  }
}
