/* eslint-disable @typescript-eslint/no-explicit-any */

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
