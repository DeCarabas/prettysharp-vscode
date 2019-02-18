// prettysharp-vscode
// Copyright(C) 2019 John Doty
//
// This program is free software: you can redistribute it and / or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.If not, see < https://www.gnu.org/licenses/>.

import * as vscode from "vscode";
import * as cp from "child_process";

class PrettySharpDocumentFormattingEditProvider
  implements vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return new Promise((resolve, reject) => {
      const prettysharpCommand = this.getCommand(document);

      let stdout = "";
      let stderr = "";
      const proc = cp.spawn(prettysharpCommand);
      token.onCancellationRequested(() => !proc.killed && proc.kill());

      proc.stdout.setEncoding("utf8");
      proc.stdout.on("data", chunk => (stdout += chunk));

      proc.stderr.setEncoding("utf8");
      proc.stderr.on("data", chunk => (stderr += chunk));

      proc.on("error", err => {
        if (err && (<any>err).code === "ENOENT") {
          const message =
            "The '" +
            prettysharpCommand +
            "' command is not available. Check to make sure PrettySharp is " +
            "properly installed there, or correct your " +
            "`prettysharp.executable` setting.";
          vscode.window.showInformationMessage(message);
          return resolve(null);
        } else {
          return reject(err);
        }
      });

      proc.on("close", code => {
        if (proc.pid === 0) {
          return;
        }

        if (code !== 0) {
          return reject(stderr);
        } else {
          // Apparently VSCode handles doing the diff and minimal edits and
          // stuff. That's *super* convenient, thanks VSCode!
          const fileStart = new vscode.Position(0, 0);
          const fileEnd = document.lineAt(document.lineCount - 1).range.end;
          const textEdits: vscode.TextEdit[] = [
            new vscode.TextEdit(new vscode.Range(fileStart, fileEnd), stdout)
          ];

          return resolve(textEdits);
        }
      });

      if (proc.pid) {
        proc.stdin.end(document.getText(), "utf8");
      }
    });
  }

  private getCommand(document: vscode.TextDocument): string {
    const command =
      vscode.workspace
        .getConfiguration("prettysharp")
        .get<string>("executable") || "prettysharp";

    const folder = vscode.workspace.getWorkspaceFolder(document.uri);
    const workspaceRoot = folder ? folder.uri.fsPath : "";

    return command
      .replace(/\${workspaceRoot}/g, workspaceRoot)
      .replace(/\${cwd}/g, process.cwd())
      .replace(/\${env\.([^}]+)}/g, (sub: string, envName: string) => {
        return process.env[envName] || "";
      });
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      "csharp",
      new PrettySharpDocumentFormattingEditProvider()
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
