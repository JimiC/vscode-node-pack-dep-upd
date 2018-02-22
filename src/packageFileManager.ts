import vscode from 'vscode';
import { DependenciesFlags } from './enumerations';
import { IDependencies, IPackageDependencies } from './models';

export class PackageFileManager {

  private _packageFileContent: any;

  constructor(private _textDoc: vscode.TextDocument) {
    this._packageFileContent = this._textDoc
      ? JSON.parse(this._textDoc.getText())
      : {};
  }

  public get allDependencies(): IPackageDependencies {
    return {
      dependencies: this.dependencies,
      devDependencies: this.devDependencies,
      optionalDependencies: this.optionalDependencies,
      peerDependencies: this.peerDependencies,
    };
  }

  public get dependencies(): IDependencies {
    return this._packageFileContent.dependencies;
  }

  public get devDependencies(): IDependencies {
    return this._packageFileContent.devDependencies;
  }

  public get peerDependencies(): IDependencies {
    return this._packageFileContent.peerDependencies;
  }

  public get optionalDependencies(): IDependencies {
    return this._packageFileContent.optionalDependencies;
  }

  public getDependencies(flag: DependenciesFlags): IPackageDependencies {
    switch (flag) {
      case DependenciesFlags.All:
        return this.allDependencies;
      case DependenciesFlags.Prod:
        return { dependencies: this.dependencies };
      case DependenciesFlags.Dev:
        return { devDependencies: this.devDependencies };
      case DependenciesFlags.Peer:
        return { peerDependencies: this.peerDependencies };
      case DependenciesFlags.Optional:
        return { optionalDependencies: this.optionalDependencies };
      default:
        throw new Error('Not Implemented');
    }
  }

  public persist(resolvedDependecies: IPackageDependencies): void {
    if (!Object.keys(resolvedDependecies).length) {
      return;
    }

    if (resolvedDependecies.dependencies) {
      this._packageFileContent.dependencies = resolvedDependecies.dependencies;
    }
    if (resolvedDependecies.devDependencies) {
      this._packageFileContent.devDependencies = resolvedDependecies.devDependencies;
    }
    if (resolvedDependecies.peerDependencies) {
      this._packageFileContent.peerDependencies = resolvedDependecies.peerDependencies;
    }
    if (resolvedDependecies.optionalDependencies) {
      this._packageFileContent.optionalDependencies = resolvedDependecies.optionalDependencies;
    }

    this._textDoc.save();
  }
}
