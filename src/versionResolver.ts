import { Uri, WorkspaceConfiguration } from 'vscode';
import { IDependencies, IPackageDependencies } from './models';

export class VersionResolver {

  private readonly _registry: Uri;
  private readonly _policy: string;
  private readonly _keepRange: boolean;

  constructor(config: WorkspaceConfiguration) {
    this._registry = Uri.parse(config.get<string>('registry'));
    this._policy = config.get<string>('policy');
    this._keepRange = config.get<boolean>('keepRange');
  }

  public async resolve(dependencies: IPackageDependencies): Promise<IPackageDependencies> {
    console.dir(this._registry);
    console.dir(this._policy);
    console.dir(this._keepRange);

    const depends = this._getAggregatedDependencies(dependencies);

    for (const dep in depends) {
      if (!Reflect.has(depends, dep)) { continue; }

      // TODO: resolve version on criteria
      console.dir(depends[dep]);
    }

    return Promise.resolve(dependencies);
  }

  private _getAggregatedDependencies(dependencies: IPackageDependencies): IDependencies {
    return Reflect.ownKeys(dependencies)
      .filter(key => dependencies[key])
      .map<IDependencies>(key => dependencies[key])
      .reduce((p: IDependencies, c: IDependencies) => ({ ...p, ...c }), {});
  }
}
