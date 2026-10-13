import joi from 'joi';
import { type Alias, type AliasTask } from '../alias.interfaces.ts';

const aliasTypeSchema = joi.string().allow('parallel', 'sequential');

const aliasTaskSchema = joi.object<AliasTask>({
  name: joi.string(),
  type: aliasTypeSchema,
  cmd: joi
    .alternatives(joi.string().min(1), joi.array().items(joi.string()).min(1))
    .required(),
  workingDirectory: joi.string(),
  interactive: joi.boolean()
});

const aliasSchema = joi.object<Alias>({
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
  workingDirectory: joi.string(),
  interactive: joi.boolean()
});

const aliasesSchema = joi.array().items(aliasSchema);

export const validateAliases = async (aliases: unknown): Promise<Alias[]> => {
  await aliasesSchema.validateAsync(aliases);
  return aliases as Alias[];
};
