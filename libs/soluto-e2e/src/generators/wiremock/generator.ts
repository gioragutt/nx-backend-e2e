import {
  addDependenciesToPackageJson,
  formatFiles,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';
import { DOCKER_COMPOSE_YAML, WIREMOCK_SERVICE_NAME } from '../../utils/constants';
import {
  addDependsOnToService,
  addServiceFromDefinitionFile,
  findServiceOfTestedProject,
} from '../../utils/docker-compose';
import { wiremockRestClientVersion } from '../../utils/versions';
import { updateYaml } from '../../utils/yaml';
import { WiremockGeneratorSchema } from './schema';

export async function wiremockGenerator(tree: Tree, options: WiremockGeneratorSchema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  updateYaml(tree, join(projectConfig.root, DOCKER_COMPOSE_YAML), yaml => {
    addDependsOnToService(findServiceOfTestedProject(yaml), WIREMOCK_SERVICE_NAME);

    addServiceFromDefinitionFile(
      yaml,
      WIREMOCK_SERVICE_NAME,
      join(__dirname, 'files', 'wiremock-service.yaml'),
    );

    return yaml;
  });

  const installDeps = addDependenciesToPackageJson(
    tree,
    {},
    { 'wiremock-rest-client': wiremockRestClientVersion },
  );

  await formatFiles(tree);

  return () => installDeps();
}

export default wiremockGenerator;
