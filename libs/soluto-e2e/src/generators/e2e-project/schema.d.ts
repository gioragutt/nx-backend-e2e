export interface E2eProjectGeneratorSchema {
  name?: string;
  project: string;
  tags?: string;
  directory?: string;
  wiremock?: boolean;
  oidcServerMock?: boolean;
}
