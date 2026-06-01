import * as vscode from 'vscode';
import { execFile } from 'child_process';
import * as path from 'path';

const commentPrefixes: Record<string, string> = {
  javascript: '//',
  typescript: '//',
  cpp: '//',
  c: '//',
  java: '//',
  python: '#',
  ruby: '#',
  lua: '--',
  bash: '#',
  rust: '//',
  go: '//',
};

let decorationType: vscode.TextEditorDecorationType;

function getCommentPrefix(languageId: string): string {
  return commentPrefixes[languageId] || '//';
}

// async function renderLatex(scriptPath: string, latex: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//    execFile('node', [scriptPath, latex], (err: Error | null, stdout: string) => {
//       if (err) reject(err);
//       else resolve(stdout.trim());
//     });
//   });
// }

async function renderLatex(scriptPath: string, latex: string): Promise<string> {
  console.log('script path:', scriptPath);
  return new Promise((resolve, reject) => {
    console.log('latex:', latex);
    execFile('node', [scriptPath, latex], (err: Error | null, stdout: string) => {
      if (err) {
        console.error('latex-comments error:', err.message, 'for latex:', latex);
        reject(err);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function updateDecorations(editor: vscode.TextEditor, scriptPath: string) {
  const document = editor.document;
  const prefix = getCommentPrefix(document.languageId);
  const pattern = new RegExp(escapeRegex(prefix) + '!(\\w*)\\s*\\$(.+?)\\$');
  
  const decorations: vscode.DecorationOptions[] = [];

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    const match = line.text.match(pattern);
    if (match) {
      try {
        const color = match[1];
        const latex = match[2];
        const unicode = await renderLatex(scriptPath, latex);

        const colorMap: Record<string, string> = {
          red: '#ff5555',
          blue: '#8be9fd',
          green: '#50fa7b',
          yellow: '#f1fa8c',
          orange: '#ffb86c',
          purple: '#bd93f9',
          pink: '#ff79c6',
        };

        const decoration: vscode.DecorationOptions = {
          range: new vscode.Range(i, line.text.length, i, line.text.length),
          renderOptions: {
            after: {
              contentText: '  ' + unicode,
              color: colorMap[color] || new vscode.ThemeColor('editorLineNumber.foreground'),
            }
          }
        };
        decorations.push(decoration);
      } catch (e) {
        console.error('latex-comments error:', e);
      }
    }
  }

  editor.setDecorations(decorationType, decorations);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function activate(context: vscode.ExtensionContext) {
  // const scriptPath = path.join(context.extensionPath, 'scripts', 'render.js');
  const scriptPath = path.join(context.extensionPath, '..', 'scripts', 'render.js');

  decorationType = vscode.window.createTextEditorDecorationType({});

  const triggerUpdate = (editor: vscode.TextEditor) => {
    updateDecorations(editor, scriptPath);
  };

  // trigger on open
  if (vscode.window.activeTextEditor) {
    triggerUpdate(vscode.window.activeTextEditor);
  }

  // trigger on file change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) triggerUpdate(editor);
    }),
    vscode.workspace.onDidSaveTextDocument(document => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) triggerUpdate(editor);
    })
  );
}

export function deactivate() {}
