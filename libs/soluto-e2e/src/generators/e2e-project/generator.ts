import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/node';
import * as path from 'path';
import { ensureProjectExists } from '../../utils/nx';
import { oidcServerMockGenerator } from '../oidc-server-mock/generator';
import { wiremockGenerator } from '../wiremock/generator';
import { E2eProjectGeneratorSchema } from './schema';

interface NormalizedSchema extends E2eProjectGeneratorSchema {
  name: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: E2eProjectGeneratorSchema): NormalizedSchema {
  const name = options.name ? names(options.name).fileName : `${options.project}-e2e`;

  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags ? options.tags.split(',').map(s => s.trim()) : [];

  return {
    ...options,
    name,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function createE2EProjectConfig(
  tree: Tree,
  normalizedOptions: NormalizedSchema,
): ProjectConfiguration {
  const generatedProjectConfig = readProjectConfiguration(tree, normalizedOptions.projectName);

  delete generatedProjectConfig.targets.build;
  delete generatedProjectConfig.targets.serve;

  Object.assign(generatedProjectConfig.targets, {
    e2e: {
      executor: '@nrwl/workspace:run-commands',
      options: {
        commands: [
          `nx up ${normalizedOptions.projectName}`,
          `nx test ${normalizedOptions.projectName}`,
          `nx down ${normalizedOptions.projectName}`,
        ],
        parallel: false,
      },
    },
    up: {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: 'docker-compose build && docker-compose up -d',
        cwd: normalizedOptions.projectRoot,
      },
    },
    down: {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: 'docker-compose down --remove-orphans',
        cwd: normalizedOptions.projectRoot,
      },
    },
  });

  return generatedProjectConfig;
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export async function e2eProjectGenerator(tree: Tree, options: E2eProjectGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  ensureProjectExists(tree, options.project);

  const installDeps = await applicationGenerator(tree, {
    standaloneConfig: true,
    ...normalizedOptions,
  });

  const projectConfig = createE2EProjectConfig(tree, normalizedOptions);

  updateProjectConfiguration(tree, normalizedOptions.projectName, projectConfig);

  tree.delete(projectConfig.sourceRoot);

  addFiles(tree, normalizedOptions);
  await formatFiles(tree);

  if (options.wiremock) {
    await wiremockGenerator(tree, { project: normalizedOptions.projectName });
  }

  if (options.oidcServerMock) {
    await oidcServerMockGenerator(tree, { project: normalizedOptions.projectName });
  }

  return () => installDeps();
}

export default e2eProjectGenerator;
