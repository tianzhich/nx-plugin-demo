import { join, Path } from '@angular-devkit/core';
import {
  Rule,
  Tree,
  chain,
  SchematicContext,
  mergeWith,
  apply,
  url,
  move,
  applyTemplates,
} from '@angular-devkit/schematics';
import { PageSchematicSchema } from './schema';
import { formatFiles, names } from '@nrwl/workspace';
import { getProjectConfig } from '@nrwl/workspace/src/utils/ast-utils';
import { Project } from 'ts-morph';

interface NormalizedSchema extends PageSchematicSchema {
  /** element className */
  className: string;
  componentName: string;
  fileName: string;
  projectSourceRoot: Path;
}

// 页面组件目录
const pagePath = 'pages';
// 路由配置目录
const routerConfigPath = 'routers/config.ts';
// 路由配置文件中需要修改的变量名
const routerConfigVariableName = 'routers';

/** 加工选项 */
function normalizeOptions(
  host: Tree,
  options: PageSchematicSchema
): NormalizedSchema {
  const { name, project } = options;
  const { sourceRoot: projectSourceRoot } = getProjectConfig(host, project);
  // kebab-case fileName and UpperCamelCase className
  const { fileName, className } = names(name);
  return {
    ...options,
    // element className
    className: `${project}-${fileName}`,
    projectSourceRoot,
    componentName: className,
    fileName,
  };
}

/** 基于模板创建文件 */
function createFiles(options: NormalizedSchema): Rule {
  const { projectSourceRoot, fileName } = options;
  const targetDir = join(projectSourceRoot, pagePath, fileName);
  return mergeWith(
    apply(url('./files'), [applyTemplates(options), move(targetDir)])
  );
}

/** 更新路由配置 */
function updateRouterConfig(options: NormalizedSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const { projectSourceRoot, fileName } = options;
    const filePath = join(projectSourceRoot, routerConfigPath);
    const srcContent = host.read(filePath).toString('utf-8');
    const project = new Project();

    const srcFile = project.createSourceFile(filePath, srcContent, {
      overwrite: true,
    });
    try {
      const decl = srcFile.getVariableDeclarationOrThrow(
        routerConfigVariableName
      );
      const initializer = decl.getInitializer().getText();
      const newInitializer = initializer.replace(
        /,?\s*}$/,
        `,'/${fileName}': '${fileName}' }`
      );
      decl.setInitializer(newInitializer);
      host.overwrite(filePath, srcFile.getFullText());
    } catch (e) {
      context.logger.error(e.message);
    }
  };
}

// 默认的rule factory
export default function (schema: PageSchematicSchema): Rule {
  return function (host: Tree, context: SchematicContext) {
    const options = normalizeOptions(host, schema);
    return chain([
      createFiles(options),
      updateRouterConfig(options),
      formatFiles({ skipFormat: false }),
    ]);
  };
}
