//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import * as path from 'path';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

    // Defines a Mocha unit test
    test("Char Count Test", (done) => {
        let counter = new myExtension.CharCounter();
        vscode.workspace.openTextDocument(path.join(__dirname, "..", "..", 'README.md'))
        .then((document) => {
            assert.equal(counter._getCharCount(document),102);
            done();
        }, (error) => {
            assert.fail(error);
            done();
        })
    });
});