import {getCmdResult} from '../../common/index.ts';
import {type DockerContainer, parseContainerRows} from './index.ts';

export const getContainers = async (
  onlyRunning = false,
): Promise<DockerContainer[]> =>
  getCmdResult('docker', ['ps', onlyRunning ? '' : '-a']).then(
    async (result) => {
      const containers = parseContainerRows(result.split('\n'));

      return Promise.all(
        containers.map(async (container) =>
          getCmdResult('docker', ['inspect', container.containerId]).then(
            (containerInfoData: string) => {
              const containerInfo = JSON.parse(containerInfoData)[0];

              return {
                ...container,
                properties: containerInfo,
              };
            },
          ),
        ),
      );
    },
  );
