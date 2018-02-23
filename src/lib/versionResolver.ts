import http from 'http';
import url from 'url';
import {
  IDependencies,
  INodePackage,
  IPackageDependencies,
  IResolverOptions,
} from './interfaces';

export class VersionResolver {

  private readonly _registryUrl: url.Url;
  private readonly _policy: string;
  private readonly _keepRange: boolean;

  constructor(private _options: IResolverOptions) {
    this._registryUrl = url.parse(this._options.registry);
    this._policy = this._options.policy;
    this._keepRange = this._options.keepRange;
  }

  public async resolve(dependencies: IPackageDependencies): Promise<IPackageDependencies> {
    const depends = this._getAggregatedDependencies(dependencies);

    for (const dep in depends) {
      if (!Reflect.has(depends, dep)) { continue; }

      const data = await this._fetchInfo(dep);
      console.dir(data);

      // TODO: resolve version on criteria
      // console.dir(depends[dep]);
      console.dir(this._policy);
      console.dir(this._keepRange);
    }

    return Promise.resolve(dependencies);
  }

  private async _fetchInfo(packageName: string): Promise<string | INodePackage> {
    const _protocol = require(this._registryUrl.protocol.slice(0, -1));
    const _address = url.resolve(this._registryUrl.href, this._urlEncode(packageName));
    const onResponce = (responce: http.IncomingMessage, res, rej) => {
      if (responce.statusCode && responce.statusMessage !== http.STATUS_CODES[200]) {
        return rej(responce.statusMessage);
      }
      let data: string;
      responce.on('data', (chunk: any) => data += chunk).on('end', _ => res(data)).setEncoding('utf8');
    };
    return new Promise<string>((res, rej) => _protocol.get(_address, responce => onResponce(responce, res, rej)));
  }

  private _urlEncode(name: string): string {
    const isOrged = name.startsWith('@');
    const resolvedName = isOrged ? name.substr(1) : name;
    return `${isOrged ? '@' : ''}${encodeURIComponent(resolvedName)}`;
  }

  private _getAggregatedDependencies(dependencies: IPackageDependencies): IDependencies {
    return Reflect.ownKeys(dependencies)
      .filter(key => dependencies[key])
      .map<IDependencies>(key => dependencies[key])
      .reduce((p: IDependencies, c: IDependencies) => ({ ...p, ...c }), {});
  }
}
