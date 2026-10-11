import {type ContainerStatus} from './container-status.ts';

export type DockerContainer = {
  containerId: string;
  names: string;
  image: string;
  command: string;
  created: string;
  status: string;
  ports: string | undefined;
  properties: {
    Id: string;
    Created: string;
    Path: string;
    Args: string[];
    State: DockerContainerState;
  };
};

export type DockerContainerState = {
  Status: ContainerStatus;
  Running: boolean;
  Paused: boolean;
  Restarting: boolean;
  OOMKilled: boolean;
  Dead: boolean;
  Pid: number;
  ExitCode: number;
  Error: string;
  StartedAt: string;
  FinishedAt: string;
};
