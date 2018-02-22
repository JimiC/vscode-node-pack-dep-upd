import { ExtensionContext } from 'vscode';
import { CommandManager } from './commandManager';
import { constants } from './constants';

export const activate = (context: ExtensionContext): void => {
  CommandManager.registerCommands(context);

  // tslint:disable-next-line no-console
  console.info(`${constants.extensionDisplayName} is active!`);
};

export const deactivate = (): void => void 0;
