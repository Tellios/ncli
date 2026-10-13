import { styleText } from 'node:util';
import { type DockerContainer } from './docker-container.interface.ts';

type Colorizer = (text: string) => string;

const color =
  (format: Parameters<typeof styleText>[0]): Colorizer =>
  (text) =>
    styleText(format, text);

export const containerStatusColoring = (
  container: DockerContainer
): Colorizer => {
  const state = container.properties.State;

  switch (state.Status) {
    case 'created': {
      return color('gray');
    }

    case 'restarting': {
      return color('yellow');
    }

    case 'running': {
      return color('green');
    }

    case 'removing': {
      return color('red');
    }

    case 'paused': {
      return color('cyan');
    }

    case 'exited': {
      return color(state.ExitCode === 0 ? 'blue' : 'red');
    }

    case 'dead': {
      return color('red');
    }
  }
};
