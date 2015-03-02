import { test, moduleFor } from 'ember-qunit';
import Ember               from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleFor('controller:application', 'controller:application', {
  needs: ['formula:plurality', 'formula:majority']
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

test('preferenceStartedMoving action sets showPreferenceOrderControl to true', function() {
  expect(1);

  var controller = this.subject({
    content: {}
  });

  controller.send('preferenceStartedMoving');

  ok(get(controller, 'showPreferenceOrderControl'), 'showPreferenceOrderControl is set correctly');
});

test('modalDismissed action sets preferenceIsMoving to null', function() {
  expect(1);

  var controller = this.subject({
    content: {},
    preferenceIsMoving: {}
  });

  controller.send('modalDismissed');

  equal(get(controller, 'preferenceIsMoving'), null, 'preferenceIsMoving is set to null');
});

test('modalDismissed action sets visibleCoinTossIndex to null', function() {
  expect(1);

  var controller = this.subject({
    content: {},
    visibleCoinTossIndex: 0
  });

  controller.send('modalDismissed');

  equal(get(controller, 'visibleCoinTossIndex'), null, 'visibleCoinTossIndex is set correctly');
});

test('modalDismissed action sets showPreferenceOrderControl to false', function() {
  expect(1);

  var controller = this.subject({
    content: {},
    showPreferenceOrderControl: true
  });

  controller.send('modalDismissed');

  ok(!get(controller, 'showPreferenceOrderControl'), 'showPreferenceOrderControl is set correctly');
});

test('movePreferenceBefore action sets preferenceMoveDirection to `previous`', function() {
  expect(1);

  var controller = this.subject({
    content: {}
  });

  controller.send('movePreferenceBefore');

  equal(get(controller, 'preferenceMoveDirection'), 'previous', 'the preferenceMoveDirection is correct');
});

test('movePreferenceAfter action sets preferenceMoveDirection to `after`', function() {
  expect(1);

  var controller = this.subject({
    content: {}
  });

  controller.send('movePreferenceAfter');

  equal(get(controller, 'preferenceMoveDirection'), 'after', 'the preferenceMoveDirection is correct');
});

test('partyAtBeginning action sets the preferencePreviousButtonDisabled to true and preferenceNextButtonDisabled to false', function() {
  expect(2);

  var controller = this.subject({
    preferenceNextButtonDisabled: true,
    preferencePreviousButtonDisabled: false
  });

  controller.send('partyAtBeginning');

  ok(get(controller, 'preferencePreviousButtonDisabled'), 'preferencePreviousButtonDisabled set to true');
  ok(!get(controller, 'preferenceNextButtonDisabled'), 'preferenceNextButtonDisabled set to false');
});

test('partyAtEnd action sets the preferenceNextButtonDisabled to true and preferencePreviousButtonDisabled to false', function() {
  expect(2);

  var controller = this.subject({
    preferenceNextButtonDisabled: false,
    preferencePreviousButtonDisabled: true
  });

  controller.send('partyAtEnd');

  ok(get(controller, 'preferenceNextButtonDisabled'), 'preferenceNextButtonDisabled set to true');
  ok(!get(controller, 'preferencePreviousButtonDisabled'), 'preferencePreviousButtonDisabled set to false');
});

test('partyAtMiddle action set preferenceNextButtonDisabled and preferencePreviousButtonDisabled to false', function() {
  expect(2);

  var controller = this.subject({
    preferenceNextButtonDisabled: true,
    preferencePreviousButtonDisabled: true
  });

  controller.send('partyAtMiddle');

  ok(!get(controller, 'preferenceNextButtonDisabled'), 'preferenceNextButtonDisabled is set to false');
  ok(!get(controller, 'preferencePreviousButtonDisabled'), 'preferencePreviousButtonDisabled is set to false');
});

test('showCointToss action set the visibleCoinTossIndex to the value that was passed in', function() {
  expect(2);

  var controller = this.subject({
    visibleCoinTossIndex: 0
  });

  controller.send('showCoinToss', 1);

  equal(get(controller, 'visibleCoinTossIndex'), 1, 'the visibleCoinTossIndex was set correctly');

  controller.send('showCoinToss', 2);

  equal(get(controller, 'visibleCoinTossIndex'), 2, 'the visibleCoinTossIndex was set correctly');
});
