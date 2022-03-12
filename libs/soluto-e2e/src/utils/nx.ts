import { readProjectConfiguration, Tree } from '@nrwl/devkit';

export function ensureProjectExists(tree: Tree, projectName: string): void {
  readProjectConfiguration(tree, projectName);
}
