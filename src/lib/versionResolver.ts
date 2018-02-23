import http from 'http';
import semver from 'semver';
import url from 'url';
import { Policy } from './enumerations';
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
    this._policy = 'latest'; // this._options.policy;
    this._keepRange = this._options.keepRange;
  }

  public async resolve(dependencies: IPackageDependencies): Promise<IPackageDependencies> {
    const depends = this._getAggregatedDependencies(dependencies);

    for (const dep in depends) {
      if (!Reflect.has(depends, dep)) { continue; }
      depends[dep] = await this._findVersion(dep, this._policy, depends[dep]);
    }

    return Promise.resolve(dependencies);
  }

  private async _findVersion(packageName: string, policy: string, defaultVersion: string): Promise<string> {
    const data: string = await this._fetchInfo(packageName);
    const info: INodePackage = JSON.parse(data);
    return this._getVersionFromPolicy(info, policy, defaultVersion);
  }

  private _getMaxSatisfiedVersion(info: INodePackage, defaultVersion: string): string {
    const aggregator = Reflect.ownKeys(info.versions).reduce((p: string[], c: string) => p.concat(c), []);
    const maxVersion = semver.maxSatisfying(aggregator, defaultVersion);
    return info.versions ? maxVersion || defaultVersion : defaultVersion;
  }

  private _getRange(newVersion: string, defaultVersion: string): string {
    if (!newVersion || !this._keepRange) { return defaultVersion; }

    // TODO: Implement other range cases
    return defaultVersion.replace(/[0-9.]+-*[a-zA-Z0-9]*/g, newVersion);
  }

  private _getVersionFromPolicy(info: INodePackage, policy: string, defaultVersion: string): string {
    switch (Policy[policy]) {
      case Policy.latest:
        return info['dist-tags']
          ? this._getRange(info['dist-tags'].latest, defaultVersion)
          : defaultVersion;
      case Policy.semver:
        return this._getMaxSatisfiedVersion(info, defaultVersion);
      default:
        throw new Error('Not Implemented');
    }
  }

  private async _fetchInfo(packageName: string): Promise<string> {
    const _protocol = require(this._registryUrl.protocol.slice(0, -1));
    const _address = url.resolve(this._registryUrl.href, this._urlEncode(packageName));
    const onResponce = (responce: http.IncomingMessage, res, rej) => {
      if (responce.statusCode && responce.statusMessage !== http.STATUS_CODES[200]) {
        return rej(new Error(responce.statusMessage));
      }
      let data = '';
      responce.on('data', (chunk: any) => data += chunk).on('end', _ => res(data)).setEncoding('utf8');
    };
    return new Promise<string>((res, rej) => _protocol.get(_address, responce => onResponce(responce, res, rej)));
  }

  private _urlEncode(name: string): string {
    const isScoped = name.startsWith('@');
    const resolvedName = isScoped ? name.substr(1) : name;
    return `${isScoped ? '@' : ''}${encodeURIComponent(resolvedName)}`;
  }

  private _getAggregatedDependencies(dependencies: IPackageDependencies): IDependencies {
    return Reflect.ownKeys(dependencies)
      .filter(key => dependencies[key])
      .map<IDependencies>(key => dependencies[key])
      .reduce((p: IDependencies, c: IDependencies) => ({ ...p, ...c }), {});
  }
}
