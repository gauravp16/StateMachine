var module = require(".././index.js");

describe("Given a review with different possible states", function(){

	it("should be able to initialize the review state machine", function(){
		var reviewstate = module.create('initial');
		expect(reviewstate.currentState.name).toBe('initial');
	});

	describe("And when I configure the different states", function(){
		var reviewstate = null;

		beforeEach(function(){
			reviewstate = module.create('initial');
		});

		it("should show the configuration", function(){
			reviewstate.configure('initial');
			expect(reviewstate.configurations.length).toBe(1);
			expect(reviewstate.configurations[0].state.name).toEqual("initial");
		});

		describe("define transitions", function(){
			var initialStateConfig = null;

			beforeEach(function(){
				initialStateConfig = reviewstate.configure('initial').allow('publish', 'draft').allow('data', 'initial');
			});

			it("should allow to define triggers for transitions to different states from current state", function(){
				expect(initialStateConfig.transitions.length).toBe(2);
				expect(initialStateConfig.transitions[0].from.name).toEqual("initial");
				expect(initialStateConfig.transitions[0].to.name).toEqual("draft");
				expect(initialStateConfig.transitions[0].trigger).toEqual("publish");
				expect(initialStateConfig.transitions[1].from.name).toEqual("initial");
				expect(initialStateConfig.transitions[1].to.name).toEqual("initial");
				expect(initialStateConfig.transitions[1].trigger).toEqual("data");
			});

			it("should allow to define transitions for different states other than current state", function(){
				expect(reviewstate.currentState.name).toBe('initial');
				var config = reviewstate.configure('draft').allow('submitted', 'submitted');
				expect(config.transitions.length).toBe(1);
				expect(config.transitions[0].from.name).toEqual("draft");
				expect(config.transitions[0].to.name).toEqual("submitted");
				expect(config.transitions[0].trigger).toEqual("submitted");
			});

			it("should not allow transition for trigger if a provided condition evaluates to false", function(){
				var config = reviewstate.configure('draft').allowIf('submitted', 'submitted', 2+2 === 5);
				expect(config.transitions.length).toBe(0);
			});

			it("should allow transition for trigger if a provided condition evaluates to true", function(){
				var config = reviewstate.configure('draft').allowIf('submitted', 'submitted', 2+2 === 4);
				expect(config.transitions.length).toBe(1);
				expect(config.transitions[0].from.name).toEqual("draft");
				expect(config.transitions[0].to.name).toEqual("submitted");
				expect(config.transitions[0].trigger).toEqual("submitted");
			});

			it("should allow to subscribe for any state transition", function(){
				var callback = function(currentStateName){result = currentStateName;};
				reviewstate.subscribe(callback);
				expect(reviewstate.listeners[0].toString()).toEqual(callback.toString());
			});


			it("should allow to unsubscribe any subscribed callback", function(){
				var callbackOne = function(currentStateName){result = currentStateName;};
				var callbackTwo = function(currentStateName){console.log(currentStateName);};
				reviewstate.subscribe(callbackOne);
				reviewstate.subscribe(callbackTwo);

				reviewstate.unsubscribe(callbackTwo);
				//expect(reviewstate.listeners[0].toString()).toEqual(callback.toString());
			});

			describe("fire transitions", function(){
				it("should return false if a transition is not possible to a different state", function(){
					expect(reviewstate.currentState.name).toBe('initial');
					reviewstate.configure('draft').allow('submitted', 'submitted');
					expect(reviewstate.canFire('publish')).toBe(true);
				});

				it("should return true if a transition is possible to a different state", function(){
					expect(reviewstate.currentState.name).toBe('initial');
					reviewstate.configure('draft').allow('submitted', 'submitted');
					expect(reviewstate.canFire('submitted')).toBe(false);
				});

				it("should return true even if a trigger does not transition to a different state other than the current state", function(){
					expect(reviewstate.currentState.name).toBe('initial');
					expect(reviewstate.canFire('data')).toBe(true);
				});

				describe("When a trigger fires", function(){
					it("should transition to a different state depending on the trigger", function(){
						expect(reviewstate.currentState.name).toBe('initial');
						reviewstate.configure('draft').allow('submitted', 'submitted');
						reviewstate.fire('publish');
						expect(reviewstate.currentState.name).toBe('draft');
					});
					
					it("should be in the same state if the trigger does not require it to be in a different state", function(){
						expect(reviewstate.currentState.name).toBe('initial');
						reviewstate.fire('data');
						expect(reviewstate.currentState.name).toBe('initial');
					});

					it("should notify if any listener has subscribed for state transition", function(){
						var result = '';

						expect(reviewstate.currentState.name).toBe('initial');
						reviewstate.subscribe(function(currentStateName){result = currentStateName;});
						reviewstate.fire('publish');
						expect(result).toBe('draft');
					});
				});
			});
		})
	});
});
