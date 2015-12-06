# StateMachine
Simple state machine implemented in javascript, distributable as node package.

Example usage:

var module = require('./index.js');
var reviewstate = module.create('initial');
reviewstate.configure('initial').allow('publish', 'draft');
reviewstate.configure('draft').allow('submitted','submitted');

reviewstate.fire('publish');

