import { stdin } from 'process';

export type ShortcutCallback = () => void;

export const CommonShortcuts = {
  Ctrl_C: '\u0003',
  Ctrl_D: '\u0004',
  Ctrl_L: '\u000C'
};

export class ShortcutListener {
  private shortcuts: Map<string, ShortcutCallback> = new Map();

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

  private onStdinData = (data: Buffer) => {
    const input = data.toString();

    const callback = this.shortcuts.get(input);
    callback?.();
  };
}
