import { ExecaReturnValue } from 'execa';
import { IProcessOptions, ParallelProcesses, SequentialProcesses } from '.';
import { UnreachableCaseError } from '..';
import { IProcessRunOptions } from './Process';
import { ProcessesBase } from './ProcessesBase';

export interface IProcessingTask {
  type: 'sequential' | 'parallel';
  options: IProcessOptions[];
}

export class TaskProcesses extends ProcessesBase {
  protected readonly tasks: ReadonlyArray<ProcessesBase>;
  private isExited = false;

  constructor(tasks: IProcessingTask[]) {
    super();

    this.tasks = tasks.map((task) => {
      if (task.type === 'sequential') {
        return new SequentialProcesses(task.options);
      } else if (task.type === 'parallel') {
        return new ParallelProcesses(task.options);
      } else {
        throw new UnreachableCaseError(task.type);
      }
    });
  }

  async run(options: IProcessRunOptions): Promise<ExecaReturnValue<string>[]> {
    const results: ExecaReturnValue<string>[] = [];

    for await (const task of this.tasks) {
      if (this.isExited) {
        return results;
      }

      const taskResult = await task.run(options);
      results.push(...taskResult);
    }

    return results;
  }

  exit(): Promise<void> {
    this.isExited = true;
    return super.exit();
  }
}
