import * as joi from 'joi';
import { IAlias, IAliasTask } from '../alias.interfaces';

const aliasTypeSchema = joi.string().allow('parallel', 'sequential');

const aliasTaskSchema = joi.object<IAliasTask>({
  name: joi.string(),
  type: aliasTypeSchema,
  cmd: joi
    .alternatives(joi.string().min(1), joi.array().items(joi.string()).min(1))
    .required(),
  workingDirectory: joi.string()
});

const aliasSchema = joi.object<IAlias>({
  name: joi.string().required(),
  type: aliasTypeSchema,
  cmd: joi
    .alternatives(
      joi.string().min(1),
      joi.array().items(joi.string().required()).min(1),
      joi.array().items(aliasTaskSchema.required()).min(1)
    )
    .required(),
  description: joi.string(),
  workingDirectory: joi.string()
});

const aliasesSchema = joi.array().items(aliasSchema);

export const validateAliases = async (aliases: unknown): Promise<IAlias[]> => {
  await aliasesSchema.validateAsync(aliases);
  return aliases as IAlias[];
};
