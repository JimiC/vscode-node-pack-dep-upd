import path from 'path';
import vscode from 'vscode';
import { constants } from './constants';
import { DependenciesFlags } from './enumerations';
import { IPackageDependencies, IResolverOptions } from './interfaces';
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
      const status: vscode.Disposable = vscode.window.setStatusBarMessage('Updating dependencies...');
      const document: string = vscode.window.activeTextEditor.document.getText();
      const packageFileManager = new PackageFileManager(document);
      const dependencies: IPackageDependencies = packageFileManager.getDependencies(flag);
      const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(constants.extensionShortName);
      const options: IResolverOptions = {
        keepRange: config.get<boolean>('keepRange'),
        policy: config.get<string>('policy'),
        registry: config.get<string>('registry'),
      };
      const versionResolver = new VersionResolver(options);
      const resolvedDependencies: IPackageDependencies = await versionResolver.resolve(dependencies);
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
