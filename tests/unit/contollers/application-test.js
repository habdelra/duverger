import { test, moduleFor } from 'ember-qunit';
import Ember               from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleFor('controller:application', 'controller:application', {
  setup: function(container){
    container.register('formula:plurality', function() { return 'plurality'; });
    container.register('formula:majority',  function() { return 'majority'; });
  }
});

test('_calculateElectionOutcome returns the election outcome', function() {
  expect(2);

  var expectedData = 'maths';

  var controller = this.subject({
    formula: function(data) {
      equal(data, expectedData, 'the forumula was invoked with correct data');
      return data;
    },
    preferenceGroups: expectedData
  });

  var actual = get(controller, '_calculateElectionOutcome');
  equal(actual.call(controller), expectedData, 'the data is correct');
});

test('formula retrieves the function for formulaName', function(){
  expect(2);

  var controller = this.subject({
    content: {},
    formulaName: 'plurality',
    container: this.container
  });

  var actual = get(controller, 'formula');
  equal(actual.call(controller), 'plurality', 'the formula is correct');

  set(controller, 'formulaName', 'majority');
  actual = get(controller, 'formula');
  equal(actual.call(controller), 'majority', 'the formula is correct');
});

test('when the formula changes, the election is recomputed', function() {
  expect(2);

  var formulaA = function() { return 'thing #1'; };
  var formulaB = function() { return 'thing #2'; };

  var controller = this.subject({
    content: {},
    formula: formulaA,
    _calculateElectionOutcome: function() {
      ok(true, '_calculateElectionOutcome was invoked');
      var formula = get(this, 'formula');
      return formula();
    }
  });

  set(controller, 'formula', formulaB);
  equal(get(controller, 'electionOutcome'), 'thing #2', 'the election outcome changed');
});

test('when the voter amounts change, the election is recomputed', function() {
  expect(2);

  var controller = this.subject({
    content: {},
    _calculateElectionOutcome: function() {
      ok(true, '_calculateElectionOutcome was invoked');
      return 'it`s happening!';
    },
    preferenceGroups: [{ voters: 0 }]
  });

  set(controller, 'preferenceGroups.0.voters', 1);
  equal(get(controller, 'electionOutcome'), 'it`s happening!', 'the election outcome has changed');
});

test('useFormula action sets the formulaName to the passed in formula', function(){
  expect(1);

  var controller = this.subject({
    content: {}
  });

  controller.send('useFormula', 'theory of relativity');
  equal(get(controller, 'formulaName'), 'theory of relativity', 'the formulaName is correct');
});

test('useFormula action sets the currentRunoff to 0 when the formula name is `plurality`', function() {
  expect(1);

  var controller = this.subject({
    content: {},
    currentRunoff: 1
  });

  controller.send('useFormula', 'plurality');
  equal(get(controller, 'currentRunoff'), 0, 'the currentRunoff is correct');
});

test('recalculateElectionOutcome action recomputes the electionOutcome', function() {
  expect(2);

  var controller = this.subject({
    content: {},
    _calculateElectionOutcome: function() {
      ok(true, '_calculateElectionOutcome was invoked');
      return 'it`s happening!';
    }
  });

  controller.send('recalculateElectionOutcome');
  equal(get(controller, 'electionOutcome'), 'it`s happening!', 'the election outcome has changed');
});
