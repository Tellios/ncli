import {type ExecaReturnValue} from 'execa';
import {UnreachableCaseError} from '../errors/index.ts';
import {
  type ProcessOptions,
  ParallelProcesses,
  SequentialProcesses,
} from './index.ts';
import {type ProcessRunOptions} from './process.ts';
import {ProcessesBase} from './processes-base.ts';

export type ProcessingTask = {
  type: 'sequential' | 'parallel';
  options: ProcessOptions[];
};

export class TaskProcesses extends ProcessesBase {
  protected readonly tasks: readonly ProcessesBase[];
  private isExited = false;

  constructor(tasks: ProcessingTask[]) {
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

  async run(options: ProcessRunOptions): Promise<ExecaReturnValue[]> {
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
