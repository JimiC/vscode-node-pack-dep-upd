import url from 'url';
import { IDependencies, IPackageDependencies, IResolverOptions } from './interfaces';

export class VersionResolver {

  private readonly _registry: url.Url;
  private readonly _policy: string;
  private readonly _keepRange: boolean;

  constructor(private _options: IResolverOptions) {
    this._registry = url.parse(this._options.registry);
    this._policy = this._options.policy;
    this._keepRange = this._options.keepRange;
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
