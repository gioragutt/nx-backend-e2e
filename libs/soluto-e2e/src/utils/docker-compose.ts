/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { load, dump, LoadOptions, DumpOptions } from 'js-yaml';

export function findServiceOfTestedProject(dockerCompose: any): any {
  return Object.values(dockerCompose.services).find(
    (service: any) => service.build?.args?.APP_NAME,
  );
}

export function addDependsOnToService(service: any, dependencyName: string): void {
  service.depends_on ||= [];

  if (!service.depends_on.includes(dependencyName)) {
    service.depends_on.push(dependencyName);
  }
}

export function addService(dockerCompose: any, serviceName: string, definition: any): void {
  if (!dockerCompose.services[serviceName]) {
    dockerCompose.services[serviceName] = definition;
  }
}

export function addServiceFromDefinitionFile(
  dockerCompose: any,
  serviceName: string,
  definitionFilePath: string,
  loadOptions?: LoadOptions,
): void {
  const definition = load(readFileSync(definitionFilePath, 'utf-8'), loadOptions);
  addService(dockerCompose, serviceName, definition);
}
