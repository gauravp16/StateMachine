var module = require('./index.js');

var reviewstate = module.create('initial');

reviewstate.configure('initial').allow('publish', 'draft');
reviewstate.configure('draft').allow('submitted','submitted');

reviewstate.on('stateChange', function(stateChange){
	console.log('Current state : ' +  stateChange.currentStateName);
	console.log('Previous state : ' +  stateChange.previousStateName);
});
reviewstate.fire('publish');
reviewstate.fire('submitted');




