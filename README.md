# StateMachine
Simple state machine implemented in javascript, distributable as node package. Npm registry location

Example usage:

var module = require('./index.js');

//create state machine to represent review state.<br/>
var reviewstate = module.create('initial');

//State transition from 'initial' to 'draft' if 'publish' is triggered.<br/>
reviewstate.configure('initial').allow('publish', 'draft');

//State transition from 'draft' to 'submitted' if 'submitted' is triggered.<br/>
reviewstate.configure('draft').allow('submitted','submitted');

//register any callback that is invoked when state transition occurs.<br/>
reviewstate.subscribe(function(currentStateName){console.log(currentStateName);});

//fire trigger.<br/>
reviewstate.fire('publish');

