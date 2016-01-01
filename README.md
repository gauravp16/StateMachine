## Installation
npm install --save filelistener

## Usage
Simple state machine implemented in javascript, distributable as node package.

```javascript
var module = require('./index.js');

//create state machine to represent review state.
var reviewstate = module.create('initial');

//State transition from 'initial' to 'draft' if 'publish' is triggered.
reviewstate.configure('initial').allow('publish', 'draft');

//State transition from 'draft' to 'submitted' if 'submitted' is triggered.
reviewstate.configure('draft').allow('submitted','submitted');

//register any callback that is invoked when state transition occurs.
reviewstate.on('stateChange', function(stateChange){
	console.log('Current state : ' +  stateChange.currentStateName);
	console.log('Previous state : ' +  stateChange.previousStateName);
});

//fire trigger.
reviewstate.fire('publish');
```
## License
Licensed under MIT

