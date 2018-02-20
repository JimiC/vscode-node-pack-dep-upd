import path from 'path';
import vscode from 'vscode';
import { constants } from './constants';
import { DependenciesFlags } from './enumerations';
import * as utils from './utils/helper';

function handleCommandError(): boolean {
  if (utils.isNullOrUndefind(vscode, 'window', 'activeTextEditor', 'document', 'fileName')) {
    return true;
  }
  if (path.basename(vscode.window.activeTextEditor.document.fileName) === 'package.json') {
    return false;
  }
  vscode.window.showWarningMessage('Please use with a "package.json" file.');
  return true;
}

function updateCommand(flag?: DependenciesFlags): void {
  try {
    // tslint:disable-next-line:no-console
    console.log(flag);
    if (handleCommandError()) { return; }
  } catch (error) {
    console.error(error.stack || error.message || error);
  }
}

function registerCommand(
  context: vscode.ExtensionContext,
  name: string,
  callback: (...args: any[]) => any): void {
  const command = vscode.commands.registerCommand(`${constants.extensionName}.${name}`, callback);
  context.subscriptions.push(command);
}

export const registerCommands = (context: vscode.ExtensionContext): void => {
  registerCommand(context, 'updateAll', () => updateCommand(DependenciesFlags.All));
  registerCommand(context, 'updateDepOnly', () => updateCommand(DependenciesFlags.Prod));
  registerCommand(context, 'updateDevDepOnly', () => updateCommand(DependenciesFlags.Dev));
  registerCommand(context, 'updatePeerDepOnly', () => updateCommand(DependenciesFlags.Peer));
  registerCommand(context, 'updateOptDepOnly', () => updateCommand(DependenciesFlags.Optional));
};
