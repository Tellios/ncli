import { ISettingDescription } from './ISettingDescription';
import { SettingType } from './SettingType';

/**
 * To be able to create the inferred types for the
 * ISettingsFor interface a little bit of complexity
 * is required. The below class solution to generate
 * the setting descriptions essentially mimics
 * yargs builder type definitions.
 *
 * Without this approach, keys of the setting
 * descriptions wouldn't be inferrable.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
class Builder<T = {}> {
  private settings: any = {};

  public add<K extends string, TSettingType extends SettingType>(
    key: K,
    description: ISettingDescription<TSettingType>
  ): Builder<T & { [key in K]: ISettingDescription<TSettingType> }> {
    this.settings[key] = description;
    return this as any;
  }

  public getSettings(): T {
    return this.settings;
  }
}

export const availableSettings = {
  ncommit: new Builder()
    .add('noVerify', {
      description: 'Sets the default for noVerify',
      type: 'boolean'
    })
    .add('addAll', {
      description: 'Sets the default for addAll',
      type: 'boolean'
    })
    .add('push', {
      description: 'Sets the default for push',
      type: 'boolean'
    })
    .add('tags', {
      description: 'Whether tags should be pushed by default',
      type: 'boolean'
    })
    .add('force', {
      description: 'Whether --force flag should be enabled by default',
      type: 'boolean'
    })
    .getSettings(),
  npush: new Builder()
    .add('noVerify', {
      description: 'Sets the default for noVerify',
      type: 'boolean'
    })
    .add('tags', {
      description: 'Whether tags should be pushed by default',
      type: 'boolean'
    })
    .getSettings(),
  nr: new Builder()
    .add('lastExecutedScript', {
      description: 'Last script executed in working directory',
      type: 'string',
      hidden: true
    })
    .add('lastSelectedWorkspace', {
      description: 'Last selected workspace',
      type: 'string',
      hidden: true
    })
    .getSettings(),
  na: new Builder()
    .add('lastExecutedAlias', {
      description: 'Last alias executed in working directory',
      type: 'string',
      hidden: true
    })
    .getSettings(),
  ni: new Builder()
    .add('saveExact', {
      description: 'If save-exact should be enabled or disabled by default',
      type: 'boolean'
    })
    .add('lastSelectedWorkspace', {
      description: 'Last selected workspace',
      type: 'string',
      hidden: true
    })
    .getSettings()
};

export type IAvailableSettings = typeof availableSettings;
