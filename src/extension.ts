/*---------------------------------------------------------------------------------------------
*  Copyright (c) Alessandro Fragnani. All rights reserved.
*  Licensed under the MIT License. See License.md in the project root for license information.
*--------------------------------------------------------------------------------------------*/

'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { WhatsNewDelphiKeybindingsContentProvider } from "./whats-new/DelphiKeybindingsContentProvider";
import { WhatsNewManager } from "../vscode-whats-new/src/Manager";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let provider = new WhatsNewDelphiKeybindingsContentProvider();
    let viewer = new WhatsNewManager(context).registerContentProvider("delphi-keybindings", provider);
    viewer.showPageInActivation();
    context.subscriptions.push(vscode.commands.registerCommand('delphiKeybindings.whatsNew', () => viewer.showPage()))

    function selectWord(editor: vscode.TextEditor): boolean {
        const selection = editor.selection;
        const doc = editor.document;
        if (selection.isEmpty) {
            const cursorWordRange = doc.getWordRangeAtPosition(selection.active);
            
            if (cursorWordRange) {
                let newSe = new vscode.Selection(cursorWordRange.start.line, cursorWordRange.start.character, cursorWordRange.end.line, cursorWordRange.end.character);
                editor.selection = newSe;
                return true;
                
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    let disposableSelectWord = vscode.commands.registerCommand('delphiKeybindings.selectWord', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showInformationMessage("Open a file first to select word");
          return;
        }
        const selection = editor.selection;
        if (selection.isEmpty) {
            selectWord(editor);
        }

    });
    context.subscriptions.push(disposableSelectWord);

    let disposableHelp = vscode.commands.registerCommand('delphiKeybindings.help', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage("Open a file first to locate help in DocWiki");
            return;
          }
        const selection = editor.selection;
        if (selection.isEmpty) {
            selectWord(editor);
        }
        let baseUrl: string = "http://docwiki.embarcadero.com/RADStudio/Tokyo/e/index.php?title=Special%3ASearch&search=%%SEARCH%%&fulltext=Search";
        baseUrl = baseUrl.replace("%%SEARCH%%", editor.document.getText(editor.selection))
        
        vscode.env.openExternal(vscode.Uri.parse(baseUrl));
    });
    context.subscriptions.push(disposableHelp);
}

// this method is called when your extension is deactivated
export function deactivate() {
}