import {
  updateProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/node';
import * as path from 'path';
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
          `nx dc-up ${normalizedOptions.projectName}`,
          `nx test ${normalizedOptions.projectName}`,
          `nx dc-down ${normalizedOptions.projectName}`,
        ],
        parallel: false,
      },
    },
    'dc-up': {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: 'docker-compose build && docker-compose up -d',
        cwd: `apps/${normalizedOptions.projectName}`,
      },
    },
    'dc-down': {
      executor: '@nrwl/workspace:run-commands',
      options: {
        command: 'docker-compose down --remove-orphans',
        cwd: `apps/${normalizedOptions.projectName}`,
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

export default async function (tree: Tree, options: E2eProjectGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const installDeps = await applicationGenerator(tree, normalizedOptions);

  const projectConfig = createE2EProjectConfig(tree, normalizedOptions);

  updateProjectConfiguration(tree, normalizedOptions.projectName, projectConfig);

  tree.delete(projectConfig.sourceRoot);

  addFiles(tree, normalizedOptions);
  await formatFiles(tree);

  return () => installDeps();
}
