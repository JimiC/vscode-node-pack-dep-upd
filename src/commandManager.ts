import path from 'path';
import vscode from 'vscode';
import { constants } from './constants';
import { DependenciesFlags } from './lib/enumerations';
import { IPackageDependencies, IResolverOptions } from './lib/interfaces';
import { PackageFileManager } from './lib/packageFileManager';
import * as utils from './lib/utils/helper';
import { VersionResolver } from './lib/versionResolver';

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
    const sbi = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    try {
      sbi.show();
      sbi.text = '$(broadcast)  Updating dependencies...';
      if (this._handleCommandError()) { return; }
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
      // TODO: Select best color for all themes
      sbi.color = '#4bff4b';
      sbi.text = '$(check)  Dependencies updated';
    } catch (error) {
      console.error(error.stack || error.message || error);
      // TODO: Select best color for all themes
      sbi.color = '#ff4b4b';
      sbi.text = '$(alert)  NDU failed to update the dependencies';
    } finally {
      setTimeout(() => sbi.dispose(), 3000);
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
