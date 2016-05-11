'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument}  from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "charcount" is now active!');
    
    // create a new char counter
    let charCounter = new CharCounter();
    let controller = new CharCounterController(charCounter);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        //window.showInformationMessage('Hello World!');
        charCounter.updateCharCount();
    });

    context.subscriptions.push(controller);
    context.subscriptions.push(charCounter);
    context.subscriptions.push(disposable);
}

class CharCounter {
    private _statusBarItem: StatusBarItem;
    
    public updateCharCount(){
        if(!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }
        let editor = window.activeTextEditor;
        if(!editor) {
            this._statusBarItem.hide();
            return;
        }
        let doc = editor.document;
        if(doc.languageId === "markdown") {
            let charCount = this._getCharCount(doc);
            this._statusBarItem.text = charCount !== 1 ? `$(pencil) ${charCount} Chars` : `$(pencil)1 Char`;
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }
    
    public _getCharCount(doc: TextDocument): number {
        let docContent = doc.getText();
        docContent = docContent.replace(/(< ([^>]+)<)/g, '')
                                             .replace(/\s+/g, '')
                                             .replace(/^\s\s*/, '')
                                             .replace(/\s\s*$/, '');
        let charCount = 0;
        if(docContent != "") {
            charCount = docContent.length;
        }
        return charCount;
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}

class CharCounterController {
    private _charCounter: CharCounter;
    private _disposable: Disposable;
    
    constructor(charCounter: CharCounter) {
        this._charCounter = charCounter;
        this._charCounter.updateCharCount();
        
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        
        this._charCounter.updateCharCount();
        this._disposable = Disposable.from(...subscriptions);
        
    }
    
    dispose() {
        this._disposable.dispose();
    }
    
    private _onEvent() {
        this._charCounter.updateCharCount();
    }
    
}

// this method is called when your extension is deactivated
export function deactivate() {
}