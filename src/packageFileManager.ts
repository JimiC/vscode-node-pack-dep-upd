import vscode from 'vscode';
import { DependenciesFlags } from './enumerations';

export class PackageFileManager {

  private _packageJsonFile: any;

  constructor(private _textDoc: vscode.TextDocument) {
    this._packageJsonFile = this._textDoc
      ? JSON.parse(this._textDoc.getText())
      : {};
  }

  public getDependencies(flag: DependenciesFlags): any {
    switch (flag) {
      case DependenciesFlags.All:
        return this.allDependencies();
      case DependenciesFlags.Prod:
        return this.dependencies();
      case DependenciesFlags.Dev:
        return this.devDependencies();
      case DependenciesFlags.Peer:
        return this.peerDependencies();
      case DependenciesFlags.Optional:
        return this.optionalDependencies();
      default:
        throw new Error('Not Implemented');
    }
  }

  public get allDependencies(): any {
    return {
      ...this.dependencies(),
      ...this.devDependencies(),
      ...this.peerDependencies(),
      ...this.optionalDependencies(),
    };
  }

  public get dependencies(): any {
    return this._packageJsonFile.dependencies;
  }

  public get devDependencies(): any {
    return this._packageJsonFile.devDependencies;
  }

  public get peerDependencies(): any {
    return this._packageJsonFile.peerDependencies;
  }

  public get optionalDependencies(): any {
    return this._packageJsonFile.optionalDependencies;
  }
}
