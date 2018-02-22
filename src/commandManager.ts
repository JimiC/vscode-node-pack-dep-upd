import path from 'path';
import vscode from 'vscode';
import { constants } from './constants';
import { DependenciesFlags } from './enumerations';
import { PackageFileManager } from './packageFileManager';
import * as utils from './utils/helper';
import { VersionResolver } from './versionResolver';

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
    const command = vscode.commands.registerCommand(`${constants.extensionShortName}.${name}`, callback);
    context.subscriptions.push(command);
  }

  private static async _updateCommand(flag?: DependenciesFlags): Promise<void> {
    try {
      if (this._handleCommandError()) { return; }
      const status = vscode.window.setStatusBarMessage('Updating dependencies...');
      const packageFileManager = new PackageFileManager(vscode.window.activeTextEditor.document);
      const dependencies = packageFileManager.getDependencies(flag);
      const config = vscode.workspace.getConfiguration(constants.extensionShortName);
      const versionResolver = new VersionResolver(config);
      const resolvedDependencies = await versionResolver.resolve(dependencies);
      await packageFileManager.persist(resolvedDependencies);
      status.dispose();
      vscode.window.setStatusBarMessage('Dependencies updated', 3000);
    } catch (error) {
      console.error(error.stack || error.message || error);
      vscode.window.setStatusBarMessage('NDU failed to update the dependencies', 5000);
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
