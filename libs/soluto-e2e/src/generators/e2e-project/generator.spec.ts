import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from '@nrwl/node';
import * as path from 'path';
import { readYaml } from '../../utils/yaml';
import { e2eProjectGenerator } from './generator';
import { E2eProjectGeneratorSchema } from './schema';

const project = 'backend-project';
const e2eProject = `${project}-e2e`;

describe('e2e-project generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);
  });

  async function createProject(config: Partial<E2eProjectGeneratorSchema> = {}) {
    await applicationGenerator(tree, { name: project });
    await e2eProjectGenerator(tree, { project, ...config });
  }

  it('should not create an e2e project when the tested project does not exist', async () => {
    await expect(e2eProjectGenerator(tree, { project })).rejects.toThrow(
      /cannot find configuration for 'backend-project'/i,
    );
  });

  it('should run successfully with default configurations', async () => {
    await createProject();

    const config = readProjectConfiguration(tree, e2eProject);
    expect(config).toBeDefined();
  });

  it('should create a docker-compose.yaml file', async () => {
    await createProject();

    const { root: e2eRoot } = readProjectConfiguration(tree, e2eProject);
    const { root: appRoot } = readProjectConfiguration(tree, project);

    const dockerCompose = readYaml(tree, path.join(e2eRoot, 'docker-compose.yaml'));

    expect(dockerCompose).toMatchObject({
      services: {
        [project]: {
          build: {
            context: '../..',
            dockerfile: path.join(appRoot, 'Dockerfile'),
            args: { APP_NAME: project },
          },
        },
      },
    });
  });

  it('should generate correct targets', async () => {
    await createProject();

    const { targets } = readProjectConfiguration(tree, e2eProject);

    expect(targets.e2e).toBeDefined();
    expect(targets.test).toBeDefined();
    expect(targets.up).toBeDefined();
    expect(targets.down).toBeDefined();
  });

  describe('configurations', () => {
    test('name', async () => {
      const name = 'my-special-e2e-project-name';

      await createProject({ name });

      const projectConfig = readProjectConfiguration(tree, name);

      expect(projectConfig.root).toBe(`apps/${name}`);
    });

    test('directory', async () => {
      const directory = 'nested-dir';

      await createProject({ directory });

      const projectConfig = readProjectConfiguration(tree, `${directory}-${e2eProject}`);

      expect(projectConfig.root).toBe(path.join('apps', directory, e2eProject));
    });
  });
});
