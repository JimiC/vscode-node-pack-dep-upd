import vscode from 'vscode';

export class PackageFileManager {

  private _packageJsonFile: any;

  constructor(private _textDoc: vscode.TextDocument) {
    this._packageJsonFile = this._textDoc
      ? JSON.parse(this._textDoc.getText())
      : {};
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
