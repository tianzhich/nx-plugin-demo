import { Tree, Rule } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';
import { PageSchematicSchema } from './schema';
import { updateWorkspace, names } from '@nrwl/workspace';

const testRunner = new SchematicTestRunner(
  '@org/plugin',
  join(__dirname, '../../../collection.json')
);

export function callRule(rule: Rule, tree: Tree) {
  return testRunner.callRule(rule, tree).toPromise();
}

export async function createFakeApp(tree: Tree, appName: string): Promise<Tree> {
  const { fileName } = names(appName);

  const appTree = await callRule(
    updateWorkspace((workspace) => {
      workspace.projects.add({
        name: fileName,
        root: `apps/${fileName}`,
        projectType: 'application',
        sourceRoot: `apps/${fileName}/src`,
        targets: {},
      });
    }),
    tree
  );
  appTree.create(
    'apps/app1/src/routers/config.ts',
    `
    export const routers = {
      // 首页
      '/': 'home',
      // 个人主页
      '/about': 'about'
    };
  `
  );
  return Promise.resolve(appTree);
}

describe('plugin schematic', () => {
  let appTree: Tree;
  const options: PageSchematicSchema = { name: 'myPage', project: 'app1' };

  beforeEach(async () => {
    appTree = createEmptyWorkspace(Tree.empty());
    appTree = await createFakeApp(appTree, 'app1');
  });

  it('should run successfully', async () => {
    const tree = await testRunner.runSchematicAsync('page', options, appTree).toPromise();
    // file exist
    expect(
      tree.exists('apps/app1/src/pages/my-page/index.tsx')
    ).toBeTruthy();
    expect(
      tree.exists('apps/app1/src/pages/my-page/index.scss')
    ).toBeTruthy();

    // router modified correctly
    const configContent = tree.readContent('apps/app1/src/routers/config.ts');
    expect(configContent).toMatch(/,\s*'\/my-page': 'my-page'/);
  });
});
