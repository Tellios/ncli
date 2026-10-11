import {type IDeployment} from './IDeployment.ts';
import {type IIngress} from './IIngress.ts';
import {type IPod} from './IPod.ts';
import {type IService} from './IService.ts';

export type IResource = IDeployment | IIngress | IPod | IService;
