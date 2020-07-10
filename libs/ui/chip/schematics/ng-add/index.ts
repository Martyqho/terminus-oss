import {
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';

/**
 *
 */
export const ngAdd = () => (tree: Tree, context: SchematicContext): Tree => {
  [
    '@angular/cdk: ^9.1.0',
    '@angular/common: ^9.1.0',
    '@angular/core: ^9.1.0',
    '@angular/forms: ^9.1.0',
    '@angular/material: ^9.1.0',
    '@angular/platform-browser: ^9.1.0',
    '@terminus/design-tokens: ^2.0.2',
    '@terminus/ngx-tools: ^8.0.5',
    '@terminus/ui-chip: ^1.0.0',
    '@terminus/ui-icon: ^1.0.0',
    '@terminus/ui-styles: ^1.0.0',
    'date-fns: 2.14.0',
    '@terminus/ui-utilities: ^1.0.0',
    'rxjs: ^6.5.0',
    'tslib: ^1.10.0',
  ].map(p => {
    const individualPackage = p.split(':');
    const nodeDependency: NodeDependency = {
      type: NodeDependencyType.Default,
      name: individualPackage[0],
      version: individualPackage[1],
      overwrite: false,
    };
    addPackageJsonDependency(tree, nodeDependency);
    context.logger.info(
      `✅️ Added dependency: ${individualPackage[0]}@${
        individualPackage[1]
      }`,
    );
    context.addTask(new NodePackageInstallTask());
  });
  return tree;
};