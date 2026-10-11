import {stdin} from 'node:process';

export type ShortcutCallback = () => void;

export const CommonShortcuts = {
  Ctrl_C: '\u{3}',
  Ctrl_D: '\u{4}',
  Ctrl_L: '\u{C}',
};

export class ShortcutListener {
  private readonly shortcuts = new Map<string, ShortcutCallback>();

  start(): void {
    stdin.on('data', this.onStdinData);
    stdin.setRawMode(true);
    stdin.setEncoding('utf-8');
    stdin.resume();
  }

  stop(): void {
    stdin.off('data', this.onStdinData);
  }

  registerShortcut(shortcut: string, callback: ShortcutCallback): void {
    this.shortcuts.set(shortcut, callback);
  }

  private readonly onStdinData = (data: Buffer) => {
    const input = data.toString();

    const callback = this.shortcuts.get(input);
    callback?.();
  };
}
