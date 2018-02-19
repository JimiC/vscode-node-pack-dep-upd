import vscode from 'vscode';
import { constants } from './constants';

export const registerCommands = (context: vscode.ExtensionContext): void => {
  registerCommand(context, 'updateAll', updateAllCommand);
  registerCommand(context, 'updateDepOnly', updateDependenciesOnlyCommand);
  registerCommand(context, 'updateDevDepOnly', updateDevDependenciesOnlyCommand);
  registerCommand(context, 'updatePeerDepOnly', updatePeerDependenciesOnlyCommand);
  registerCommand(context, 'updateOptDepOnly', updateOptionalDependenciesOnlyCommand);
};

const registerCommand = (context: vscode.ExtensionContext, name: string, callback: (...args: any[]) => any): void => {
  const command = vscode.commands.registerCommand(`${constants.extensionName}.${name}`, callback);
  context.subscriptions.push(command);
};

const updateAllCommand = (): void => void 0;

const updateDependenciesOnlyCommand = (): void => void 0;

const updateDevDependenciesOnlyCommand = (): void => void 0;

const updatePeerDependenciesOnlyCommand = (): void => void 0;

const updateOptionalDependenciesOnlyCommand = (): void => void 0;
