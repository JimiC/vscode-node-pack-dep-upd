import { IDependency } from './dependency';

export interface IPackageDependencies {
  dependencies?: IDependency;
  devDependencies?: IDependency;
  peerDependencies?: IDependency;
  optionalDependencies?: IDependency;
}
