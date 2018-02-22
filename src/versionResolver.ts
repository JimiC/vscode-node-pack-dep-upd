import { WorkspaceConfiguration } from 'vscode';

export class VersionResolver {

  private readonly _registry: string;
  private readonly _policy: string;
  private readonly _keepRange: boolean;

  constructor(config: WorkspaceConfiguration) {
    this._registry = config.get<string>('registry');
    this._policy = config.get<string>('policy');
    this._keepRange = config.get<boolean>('keepRange');
  }

  public async resolve(dependecies: any): Promise<any> {
    console.dir(this._registry);
    console.dir(this._policy);
    console.dir(this._keepRange);
    return Promise.resolve(dependecies);
  }
}
