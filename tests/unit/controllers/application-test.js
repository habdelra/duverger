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

test('totalVoters is the sum of all the voters from all the preference groups', function() {
  expect(2);

  var controller = this.subject({
    content: {},
    _calculateElectionOutcome: Ember.K,
    preferenceGroups: [{
      voters: 10
    }, {
      voters: 20
    }]
  });

  equal(get(controller, 'totalVoters'), 30, 'the totalVoters is correct');

  set(controller, 'preferenceGroups.firstObject.voters', 20);

  equal(get(controller, 'totalVoters'), 40, 'the totalVoters is correct');
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
  expect(2);

  var controller = this.subject({
    content: {}
  });

  var option = {
    value: 'theory of relativity'
  };

  controller.send('useFormula', option);
  equal(get(controller, 'formulaName'), 'theory of relativity', 'the formulaName is correct');
  ok(!get(controller, 'showFormulaList'), 'the value of showFormulaList is correct');
});

test('useFormula action sets the currentRunoff to 0 when the formula name is `plurality`', function() {
  expect(1);

  var controller = this.subject({
    content: {},
    currentRunoff: 1
  });

  var option = {
    value: 'plurality'
  };

  controller.send('useFormula', option);
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

test('viewRunoffElection sets the currentRunoff to 1', function() {
  expect(1);

  var controller = this.subject();

  controller.send('viewRunoffElection');
  equal(get(controller, 'currentRunoff'), 1, 'the currentRunoff is correct');
});

test('viewCurrentElection sets the currentRunoff to 0', function() {
  expect(1);

  var controller = this.subject();

  controller.send('viewCurrentElection');
  equal(get(controller, 'currentRunoff'), 0, 'the currentRunoff is correct');
});

test('toggleFormulaList action toggles showFormulaList property', function() {
  expect(3);

  var controller = this.subject({
    content: {}
  });

  ok(!get(controller, 'showFormulaList'), 'the value of showFormulaList is correct');

  controller.send('toggleFormulaList');

  ok(get(controller, 'showFormulaList'), 'the value of showFormulaList is correct');

  controller.send('toggleFormulaList');

  ok(!get(controller, 'showFormulaList'), 'the value of showFormulaList is correct');
});
