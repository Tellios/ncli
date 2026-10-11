import chalk, {type Chalk} from 'chalk';
import {type DockerContainer} from './docker-container.interface.ts';

export const containerStatusColoring = (container: DockerContainer): Chalk => {
  const state = container.properties.State;

  switch (state.Status) {
    case 'created': {
      return chalk.gray;
    }

    case 'restarting': {
      return chalk.yellow;
    }

    case 'running': {
      return chalk.green;
    }

    case 'removing': {
      return chalk.red;
    }

    case 'paused': {
      return chalk.cyan;
    }

    case 'exited': {
      return state.ExitCode === 0 ? chalk.blue : chalk.red;
    }

    case 'dead': {
      return chalk.red;
    }

    default: {
      throw new Error(`Unknown state: ${state.Status}`);
    }
  }
};
