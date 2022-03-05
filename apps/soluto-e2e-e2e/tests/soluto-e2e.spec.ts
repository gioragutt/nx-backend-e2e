import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('soluto-e2e e2e', () => {
  it('should create soluto-e2e', async () => {
    const plugin = uniq('soluto-e2e');
    ensureNxProject('@backend-e2e/soluto-e2e', 'dist/libs/soluto-e2e');
    await runNxCommandAsync(`generate @backend-e2e/soluto-e2e:soluto-e2e ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('soluto-e2e');
      ensureNxProject('@backend-e2e/soluto-e2e', 'dist/libs/soluto-e2e');
      await runNxCommandAsync(
        `generate @backend-e2e/soluto-e2e:soluto-e2e ${plugin} --directory subdir`,
      );
      expect(() => checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('soluto-e2e');
      ensureNxProject('@backend-e2e/soluto-e2e', 'dist/libs/soluto-e2e');
      await runNxCommandAsync(
        `generate @backend-e2e/soluto-e2e:soluto-e2e ${plugin} --tags e2etag,e2ePackage`,
      );
      const project = readJson(`libs/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
