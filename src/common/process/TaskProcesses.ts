import {type ExecaReturnValue} from 'execa';
import {UnreachableCaseError} from '../errors/index.ts';
import {
  type IProcessOptions,
  ParallelProcesses,
  SequentialProcesses,
} from './index.ts';
import {type IProcessRunOptions} from './Process.ts';
import {ProcessesBase} from './ProcessesBase.ts';

export type IProcessingTask = {
  type: 'sequential' | 'parallel';
  options: IProcessOptions[];
};

export class TaskProcesses extends ProcessesBase {
  protected readonly tasks: readonly ProcessesBase[];
  private isExited = false;

  constructor(tasks: IProcessingTask[]) {
    super();

    this.tasks = tasks.map((task) => {
      if (task.type === 'sequential') {
        return new SequentialProcesses(task.options);
      }

      if (task.type === 'parallel') {
        return new ParallelProcesses(task.options);
      }

      throw new UnreachableCaseError(task.type);
    });
  }

  async run(options: IProcessRunOptions): Promise<ExecaReturnValue[]> {
    const results: ExecaReturnValue[] = [];

    for await (const task of this.tasks) {
      if (this.isExited) {
        return results;
      }

      const taskResult = await task.run(options);
      results.push(...taskResult);
    }

    return results;
  }

  async exit(): Promise<void> {
    this.isExited = true;
    return super.exit();
  }
}
