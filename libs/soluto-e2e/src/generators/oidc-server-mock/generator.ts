import { formatFiles, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { join } from 'path';
import {
  DOCKER_COMPOSE_YAML,
  OIDC_SERVER_MOCK_SERVICE_NAME,
  WIREMOCK_SERVICE_NAME,
} from '../../utils/constants';
import {
  addDependsOnToService,
  addService,
  addServiceFromDefinitionFile,
  findServiceOfTestedProject,
} from '../../utils/docker-compose';
import { updateYaml } from '../../utils/yaml';
import { OidcServerMockGeneratorSchema } from './schema';

export default async function (tree: Tree, options: OidcServerMockGeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  updateYaml(tree, join(projectConfig.root, DOCKER_COMPOSE_YAML), yaml => {
    addDependsOnToService(findServiceOfTestedProject(yaml), OIDC_SERVER_MOCK_SERVICE_NAME);

    addServiceFromDefinitionFile(
      yaml,
      OIDC_SERVER_MOCK_SERVICE_NAME,
      join(__dirname, 'files', 'oidc-service-mock-service.yaml'),
    );

    return yaml;
  });

  await formatFiles(tree);
}
