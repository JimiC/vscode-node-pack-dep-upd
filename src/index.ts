import vscode from 'vscode';
import { registerCommands } from './commands';
import { constants } from './constants';

export const activate = (context: vscode.ExtensionContext): void => {
  registerCommands(context);
  // tslint:disable-next-line no-console
  console.info(`${constants.extensionDisplayName} is active!`);
};

export const deactivate = (): void => void 0;
