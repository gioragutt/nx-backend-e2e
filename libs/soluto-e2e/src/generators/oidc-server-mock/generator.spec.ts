import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from '@nrwl/node';
import { join } from 'path';
import { DOCKER_COMPOSE_YAML, OIDC_SERVER_MOCK_SERVICE_NAME } from '../../utils/constants';
import { readYaml } from '../../utils/yaml';
import { e2eProjectGenerator } from '../e2e-project';
import { oidcServerMockGenerator } from './generator';

const project = 'backend-project';
const e2eProject = `${project}-e2e`;

describe('oidc-server-mock generator', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace(2);

    await applicationGenerator(tree, { name: project });
    await e2eProjectGenerator(tree, { project });
    await oidcServerMockGenerator(tree, { project: e2eProject });
  });

  it('should add service to docker-compose', async () => {
    const { root } = readProjectConfiguration(tree, e2eProject);
    const { services } = readYaml(tree, join(root, DOCKER_COMPOSE_YAML));
    expect(services[OIDC_SERVER_MOCK_SERVICE_NAME]).toBeDefined();
  });

  it('should add service as dependency to tested project', async () => {
    const { root } = readProjectConfiguration(tree, e2eProject);
    const { services } = readYaml(tree, join(root, DOCKER_COMPOSE_YAML));
    expect(services[project].depends_on).toStrictEqual([OIDC_SERVER_MOCK_SERVICE_NAME]);
  });

  it('should not add service to dependencies more than once', async () => {
    await oidcServerMockGenerator(tree, { project: e2eProject });

    const { root } = readProjectConfiguration(tree, e2eProject);
    const { services } = readYaml(tree, join(root, DOCKER_COMPOSE_YAML));
    expect(services[project].depends_on).toStrictEqual([OIDC_SERVER_MOCK_SERVICE_NAME]);
  });
});
