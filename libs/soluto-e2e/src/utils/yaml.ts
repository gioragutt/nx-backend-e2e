/* eslint-disable @typescript-eslint/no-explicit-any */

import { Tree } from '@nrwl/devkit';
import { load, dump, LoadOptions, DumpOptions } from 'js-yaml';

/**
 * Reads a yaml file, removes all comments and parses YAML.
 *
 * @param tree - file system tree
 * @param path - file path
 * @param options - yaml loading options
 */
export function readYaml<T extends object = any>(
  tree: Tree,
  path: string,
  options?: LoadOptions,
): T {
  if (!tree.exists(path)) {
    throw new Error(`Cannot find ${path}`);
  }

  try {
    return load(tree.read(path, 'utf-8'), options) as T;
  } catch (e) {
    throw new Error(`Cannot parse ${path}: ${e.message}`);
  }
}

/**
 * Writes a YAML value to the file system tree
 * @param tree File system tree
 * @param path Path of YAML file in the Tree
 * @param value Serializable value to write
 * @param options Optional YAML Serialize Options
 */
export function writeYaml<T extends object = object>(
  tree: Tree,
  path: string,
  value: T,
  options?: DumpOptions,
): void {
  tree.write(path, dump(value, options));
}

/**
 * Updates a YAML value to the file system tree
 *
 * @param tree File system tree
 * @param path Path of YAML file in the Tree
 * @param updater Function that maps the current value of a YAML document to a new value to be written to the document
 * @param options Optional YAML Parse and Serialize Options
 */
export function updateYaml<T extends object = any, U extends object = T>(
  tree: Tree,
  path: string,
  updater: (value: T) => U,
  options?: LoadOptions & DumpOptions,
): void {
  const updatedValue = updater(readYaml(tree, path, options));
  writeYaml(tree, path, updatedValue, options);
}
