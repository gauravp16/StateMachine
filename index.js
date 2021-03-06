const EventEmitter = require("events").EventEmitter;
const util = require("util");

module.exports = (function(){

	function StateMachine(initialStateName){
		this.currentState = new State(initialStateName);
		this.configurations = [];
		this.listeners = [];

		EventEmitter.call(this);
	}

	util.inherits(StateMachine, EventEmitter);

	StateMachine.prototype.stateConfiguration = function (stateName){
		if(this.configurations.length === 0)
			return null;

		for(var i =0; i < this.configurations.length; i++){
			if(this.configurations[i].existsFor(stateName)){
				return this.configurations[i];
			}
		}
	};

	StateMachine.prototype.configure = function(stateName){
		var configuration = this.stateConfiguration(stateName);
		
		if(configuration === null || configuration === undefined){
			configuration = new Configuration(new State(stateName));
			this.configurations.push(configuration);
		}
		
		return configuration;
	};

	StateMachine.prototype.subscribe = function(callback){
		this.listeners.push(callback);
	};


	StateMachine.prototype.unsubscribe = function(callback){
		for(var i = 0; i < this.listeners.length; i++){
			if(callback.toString() === this.listeners[i].toString()){
				this.listeners.splice(i, 1);
			}
		}
	};

	StateMachine.prototype.canFire = function(trigger){
		var currentStateConfiguration = this.stateConfiguration(this.currentState.name);
		
		if(currentStateConfiguration === null || currentStateConfiguration === undefined)
			return false;

		if(currentStateConfiguration.transition(trigger) != null)
			return true;

		return false;
	};

	StateMachine.prototype.fire = function(trigger){
		if(this.canFire(trigger)){

			var currentStateConfiguration = this.stateConfiguration(this.currentState.name);
				
			var previousStateName = this.currentState.name;

			this.currentState = currentStateConfiguration.transition(trigger).to;

			this.emit("stateChange", new StateChange(this.currentState.name, previousStateName));
		}
	};

	function State(name){
		this.name = name;
	}

	function Transition(from, to, trigger){
		this.from = from;
		this.to = to;
		this.trigger = trigger;
	}

	function Configuration(state){
		this.state = state;
		this.transitions = [];
	}

	Configuration.prototype = {

		allow : function(trigger, to){
			var transition = new Transition(this.state, new State(to), trigger);
			this.transitions.push(transition);
			return this;
		},

		allowIf : function(trigger, to, condition){
			if(condition){
				var transition = new Transition(this.state, new State(to), trigger);
				this.transitions.push(transition);
			}
			return this;
		},

		existsFor : function(stateName){
			if(this.state.name === stateName)
				return true;

			return false;
		},

		transition : function(trigger){
			for(var i = 0; i < this.transitions.length; i++){
				if(this.transitions[i].trigger === trigger){
					return this.transitions[i];			
				}
			}
		}
	}

	function StateChange(currentStateName, previousStateName){
		this.currentStateName = currentStateName;
		this.previousStateName = previousStateName;
	}

	function create(initialStateName){
		return new StateMachine(initialStateName);
	}	

	return {
		create: create
	};
})();