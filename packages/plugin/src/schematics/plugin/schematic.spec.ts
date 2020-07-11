import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { PluginSchematicSchema } from './schema';

describe('plugin schematic', () => {
  let appTree: Tree;
  const options: PluginSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@org/plugin',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('plugin', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
