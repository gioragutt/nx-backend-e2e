/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { load, LoadOptions } from 'js-yaml';
import * as ejs from 'ejs';

export function getTestedProjectNameFromService(service: any): string | undefined {
  return service.build?.args?.APP_NAME;
}

export function findServiceOfTestedProject(dockerCompose: any): any {
  return Object.values(dockerCompose.services).find(
    (service: any) => !!getTestedProjectNameFromService(service),
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
  templateVariables: object,
  loadOptions?: LoadOptions,
): void {
  const definitionFileTemplate = readFileSync(definitionFilePath, 'utf-8');
  const renderedDefinitionFile = ejs.render(definitionFileTemplate, templateVariables);
  const definition = load(renderedDefinitionFile, loadOptions);
  addService(dockerCompose, serviceName, definition);
}
