# Practice Test Taker

Create a practice exam test bank containing as many multiple-choice questions as you want.

Generate a randomized exam from them, picking all or a subset (like 50) of questions.

Your test bank is saved in local storage, and should persist as long as your browser doesn't run out of space and you don't clear your settings. Be sure to save your questions (by clicking "Save Backup") periodically to either keep a backup, or to transfer them to another browser or computer.

## Run It

http://practicetest.connamacher.com/

## Technology Used

 * Standard ECMAScript 6 in development (without a transpiler), using only features natively supported by the browser.
 * Closure Compiler's conversion to ECMAScript 5 for the release, which includes any necessary polyfills.
 * Closure Compiler's Advanced Compilation and JSDoc-based static type enforcement. The release file is only 6kb compressed (and 5kb compressed when served without the ECMAScript 6 polyfills), and loads virtually instantaneously.
 * Vanilla JavaScript only; no frameworks are being used.