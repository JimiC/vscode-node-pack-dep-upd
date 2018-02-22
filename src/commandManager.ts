import path from 'path';
import vscode from 'vscode';
import { constants } from './constants';
import { DependenciesFlags } from './enumerations';
import * as utils from './utils/helper';

export class CommandManager {

  public static registerCommands(context: vscode.ExtensionContext): void {
    this._registerCommand(context, 'updateAll', () => this._updateCommand(DependenciesFlags.All));
    this._registerCommand(context, 'updateDepOnly', () => this._updateCommand(DependenciesFlags.Prod));
    this._registerCommand(context, 'updateDevDepOnly', () => this._updateCommand(DependenciesFlags.Dev));
    this._registerCommand(context, 'updatePeerDepOnly', () => this._updateCommand(DependenciesFlags.Peer));
    this._registerCommand(context, 'updateOptDepOnly', () => this._updateCommand(DependenciesFlags.Optional));
  }

  private static _registerCommand(
    context: vscode.ExtensionContext,
    name: string,
    callback: (...args: any[]) => any): void {
    const command = vscode.commands.registerCommand(`${constants.extensionName}.${name}`, callback);
    context.subscriptions.push(command);
  }

  private static _updateCommand(flag?: DependenciesFlags): void {
    try {
      // tslint:disable-next-line:no-console
      console.log(flag);
      if (this._handleCommandError()) { return; }
    } catch (error) {
      console.error(error.stack || error.message || error);
    }
  }

  private static _handleCommandError(): boolean {
    if (utils.isNullOrUndefind(vscode, 'window', 'activeTextEditor', 'document', 'fileName')) {
      return true;
    }
    if (path.basename(vscode.window.activeTextEditor.document.fileName) === 'package.json') {
      return false;
    }
    vscode.window.showWarningMessage('Please use with a "package.json" file.');
    return true;
  }
}
