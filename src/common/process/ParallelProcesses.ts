import type execa from 'execa';
import {
  type IProcessOptions,
  type IProcessRunOptions,
  Process,
} from './Process.ts';
import {ProcessesBase} from './ProcessesBase.ts';

export class ParallelProcesses extends ProcessesBase {
  protected readonly processes: readonly Process[];

  constructor(private readonly processOptions: IProcessOptions[]) {
    super();
    this.processes = this.processOptions.map((options) => new Process(options));
  }

  async run(options: IProcessRunOptions): Promise<execa.ExecaReturnValue[]> {
    const results: execa.ExecaReturnValue[] = [];

    const instances = this.processes.map(async (process) => {
      const result = await this.runProcess(process, options);
      result && results.push(result);
    });

    await Promise.allSettled(instances);

    return results;
  }
}
