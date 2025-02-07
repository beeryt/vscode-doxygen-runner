import * as vscode from 'vscode';

import { Doxygen } from './doxygen';
import { InstanceManager } from './instance_manager';

let instance_manager: InstanceManager;

export function activate(context: vscode.ExtensionContext) {
  instance_manager = new InstanceManager(context);

  let config = vscode.workspace.getConfiguration('doxygen_runner');

  if (config['generate_on_save'])
  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    if (document.uri.scheme === 'file') {
      vscode.commands.executeCommand('extension.doxygen-runner.generate_doxygen', this.basedir);
    }
  })

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.doxygen-runner.generate_doxygen', (filepath) => {
      try {
        let instance: Doxygen = instance_manager.getInstance(filepath);
        instance.generateDocumentation(filepath);

      } catch(err) {
        vscode.window.showErrorMessage(`Error while generating Documentation.\n${err.message}`);
      }

    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.doxygen-runner.view_doxygen', (filepath) => {
      try {
        let instance: Doxygen = instance_manager.getInstance(filepath);
        instance.updateView();

      } catch(err) {
        vscode.window.showErrorMessage(`Error while viewing Documentation.\n${err.message}`);
      }
    })
  );
}

export function deactivate() { }
