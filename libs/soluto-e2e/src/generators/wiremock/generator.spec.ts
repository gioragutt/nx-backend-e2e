import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from '@nrwl/node';
import { join } from 'path';
import { DOCKER_COMPOSE_YAML, WIREMOCK_SERVICE_NAME } from '../../utils/constants';
import { wiremockRestClientVersion } from '../../utils/versions';
import { readYaml } from '../../utils/yaml';
import { e2eProjectGenerator } from '../e2e-project';
import { wiremockGenerator } from './generator';

const project = 'backend-project';
const e2eProject = `${project}-e2e`;

xdescribe('wiremock generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace(2);

    await applicationGenerator(tree, { name: project });
    await e2eProjectGenerator(tree, { project });
    await wiremockGenerator(tree, { project: e2eProject });
  });

  it('should add service to docker-compose', () => {
    const { root } = readProjectConfiguration(tree, e2eProject);
    const { services } = readYaml(tree, join(root, DOCKER_COMPOSE_YAML));
    expect(services[WIREMOCK_SERVICE_NAME]).toBeDefined();
  });

  it('should add service as dependency to tested project', () => {
    const { root } = readProjectConfiguration(tree, e2eProject);
    const { services } = readYaml(tree, join(root, DOCKER_COMPOSE_YAML));
    expect(services[project].depends_on).toStrictEqual([WIREMOCK_SERVICE_NAME]);
  });

  it('should not add service to dependencies more than once', async () => {
    await wiremockGenerator(tree, { project: e2eProject });

    const { root } = readProjectConfiguration(tree, e2eProject);
    const { services } = readYaml(tree, join(root, DOCKER_COMPOSE_YAML));
    expect(services[project].depends_on).toStrictEqual([WIREMOCK_SERVICE_NAME]);
  });

  it('should add wiremock-rest-client to devDependencies', () => {
    const { devDependencies } = readJson(tree, 'package.json');
    expect(devDependencies['wiremock-rest-client']).toBe(wiremockRestClientVersion);
  });
});
