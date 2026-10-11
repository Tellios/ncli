import * as path from 'path';
import * as fs from 'fs-extra';
import { runCmdInConsole } from '../../common';
import {
  detectPackageManagerOrUseDefault,
  PackageManager
} from './detectPackageManager';

/**
 * Builds the arguments for executing a locally installed binary
 * with the given package manager. npm is passed --no to prevent it
 * from downloading missing packages, matching the behavior of pnpm.
 * Yarn 1 parses flags after the binary name as its own unless they
 * are separated with --.
 */
export function buildExecArgs(
  packageManager: PackageManager,
  cmd: string,
  args: string[]
): string[] {
  switch (packageManager) {
    case 'pnpm':
      return ['exec', cmd, ...args];
    case 'yarn':
      return ['exec', '--', cmd, ...args];
    case 'npm':
      return ['exec', '--no', '--', cmd, ...args];
  }
}

export async function executeBinary(
  cmd: string,
  args: string[],
  directory: string
): Promise<void> {
  const packageManager = await detectPackageManagerOrUseDefault(directory);
  await runCmdInConsole(
    packageManager,
    buildExecArgs(packageManager, cmd, args),
    true,
    directory
  );
}

/**
 * Lists the binaries installed in node_modules/.bin, excluding
 * the Windows shims generated next to each binary.
 */
export async function listBinaries(directory: string): Promise<string[]> {
  const binDirectory = path.join(directory, 'node_modules', '.bin');

  if (!(await fs.pathExists(binDirectory))) {
    return [];
  }

  const entries = await fs.readdir(binDirectory);
  const binaries = entries
    .filter((entry) => !/\.(cmd|ps1)$/i.test(entry))
    .map((entry) => entry.replace(/\.exe$/i, ''));

  return [...new Set(binaries)].sort();
}

/**
 * Splits a command line string into arguments the way a shell
 * would, keeping quoted text together and honoring backslash escapes.
 */
export function splitArguments(input: string): string[] {
  const args: string[] = [];
  let current = '';
  let inArgument = false;
  let quote: '"' | "'" | undefined;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (quote === "'") {
      if (char === "'") {
        quote = undefined;
      } else {
        current += char;
      }
    } else if (char === '\\' && i + 1 < input.length) {
      current += input[++i];
      inArgument = true;
    } else if (quote === '"') {
      if (char === '"') {
        quote = undefined;
      } else {
        current += char;
      }
    } else if (char === '"' || char === "'") {
      quote = char;
      inArgument = true;
    } else if (/\s/.test(char)) {
      if (inArgument) {
        args.push(current);
        current = '';
        inArgument = false;
      }
    } else {
      current += char;
      inArgument = true;
    }
  }

  if (quote !== undefined) {
    throw Error(`Unterminated ${quote} quote in arguments`);
  }

  if (inArgument) {
    args.push(current);
  }

  return args;
}

/**
 * Parses the remembered arguments per binary. The settings only
 * support string values, so the map is persisted as JSON.
 */
export function parseBinaryArgs(json?: string): Record<string, string> {
  if (!json) {
    return {};
  }

  try {
    const parsed = JSON.parse(json);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([, args]) => typeof args === 'string')
    ) as Record<string, string>;
  } catch {
    return {};
  }
}
