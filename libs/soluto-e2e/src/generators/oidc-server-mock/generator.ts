import { formatFiles, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { join } from 'path';
import { DOCKER_COMPOSE_YAML, OIDC_SERVER_MOCK_SERVICE_NAME } from '../../utils/constants';
import {
  addDependsOnToService,
  addServiceFromDefinitionFile,
  findServiceOfTestedProject,
  getTestedProjectNameFromService,
} from '../../utils/docker-compose';
import { updateYaml } from '../../utils/yaml';
import { OidcServerMockGeneratorSchema } from './schema';

export async function oidcServerMockGenerator(tree: Tree, options: OidcServerMockGeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  updateYaml(tree, join(projectConfig.root, DOCKER_COMPOSE_YAML), yaml => {
    const testedProjectService = findServiceOfTestedProject(yaml);
    addDependsOnToService(testedProjectService, OIDC_SERVER_MOCK_SERVICE_NAME);
    const testedProjectName = getTestedProjectNameFromService(testedProjectService);

    addServiceFromDefinitionFile(
      yaml,
      OIDC_SERVER_MOCK_SERVICE_NAME,
      join(__dirname, 'files', 'oidc-server-mock-service.yaml'),
      { serviceName: testedProjectName },
    );

    return yaml;
  });

  await formatFiles(tree);
}

export default oidcServerMockGenerator;
