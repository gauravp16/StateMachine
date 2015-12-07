var module = require('./index.js');

var reviewstate = module.create('initial');

reviewstate.configure('initial').allow('publish', 'draft');
reviewstate.configure('draft').allow('submitted','submitted');
reviewstate.subscribe(function(currentStateName){console.log(currentStateName);});

reviewstate.fire('publish');
reviewstate.fire('submitted');

console.log(reviewstate.currentState.name);



