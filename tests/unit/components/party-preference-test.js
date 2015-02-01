import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('party-preference');

test('draggable is not isFirstPreference', function() {
  expect(1);

  var component = this.subject({
    isFirstPreference: false
  });

  equal(get(component, 'draggable'), 'true', 'draggable is true');
});


test('partyName returns the party name of the `party` property', function() {
  expect(1);

  var component = this.subject({
    model: {},
    party: 'green'
  });

  equal(get(component, 'partyName'), 'Green', 'the party name is correct');
});

test('partyAbbreviation returns the party abbreviation of the `party` property', function() {
  expect(1);

  var component = this.subject({
    model: {},
    party: 'green'
  });

  equal(get(component, 'partyAbbreviation'), 'G', 'the party abbreviation is correct');
});

test('isFirstPreference returns true when the index is 0', function(){
  expect(2);

  var component = this.subject({
    model: {
      index: 0
    }
  });

  ok(get(component, 'isFirstPreference'), 'isFirstPrefernce is true');

  set(component, 'model.index', 1);
  ok(!get(component, 'isFirstPreference'), 'isFirstPrefernce is false');
});

test('mimeType returns the draggable mime type which includes the primary party name', function() {
  expect(1);

  var component = this.subject({
    primaryPreference: {
      party: 'green'
    }
  });

  equal(get(component, 'mimeType'), 'text/x-preference-green', 'the mime type is set correctly');
});

test('setEventData is triggerd on dragStart and sets data for the draggable', function() {
  expect(2);

  var event = {
    dataTransfer: {
      setData: function(mimeType, partyData) {
        equal(mimeType, 'expected MIME type', 'mime type is correct');
        equal(partyData, '{"party":"up in here"}', 'party data is correct');
      }
    }
  };

  var component = this.subject({
    model: { party: 'up in here' },
    mimeType: 'expected MIME type'
  });

  component.trigger('dragStart', event);
});

test('dragStart sends dragStarted action and sets isDragging to true', function() {
  expect(1);

  var component = this.subject({
    sendAction: function(actionName) {
      equal(actionName, 'dragStarted', 'the `dragStarted` action is fired');
    }
  });

  component.dragStart();

  // unsure how to test this since it's in an Ember.run.later
  // ok(get(component, 'isDragging'), 'isDragging is true');
});

test('dragEnd sets isDragging to false and sends dragEnded action', function() {
  expect(2);

  var component = this.subject({
    isDragging: true,
    sendAction: function(actionName) {
      equal(actionName, 'dragEnded', 'the `dragEnd` action is fired');
    }
  });

  component.dragEnd();
  ok(!get(component, 'isDragging'), 'isDragging is false');
});

test('afterPreferencesIsMovingChanged sets isMoving to false when preferenceIsMoving is falsy', function() {
  expect(2);

  var component = this.subject({
    isMoving: true,
    preferenceIsMoving: true
  });

  ok(get(component, 'isMoving'), 'isMoving is true');

  set(component, 'preferenceIsMoving', false);

  ok(!get(component, 'isMoving'), 'isMoving is false');
});

test('draggable is set to the string `true` when isFirstPreference is false, and set to string `false` when isFirstPreference is true', function() {
  expect(2);

  var component = this.subject({
    isFirstPreference: true
  });

  equal(get(component, 'draggable'), 'false', 'draggable is set to string `false`');

  set(component, 'isFirstPreference', false);

  equal(get(component, 'draggable'), 'true', 'draggable is set to string `true`');
});

test('on initialize set isMoving to true when the party is the same as the preferenceIsMoving.party', function() {
  expect(1);

  var component = this.subject({
    model: {
      party: 'teabagger',
    },
    preferenceIsMoving: {
      party: 'teabagger'
    }
  });

  ok(get(component, 'isMoving'), 'isMoving is set to true');
});

test('on initialize set isMoving to false when the party is not the same as the preferenceIsMoving.party', function() {
  expect(1);

  var component = this.subject({
    model: {
      party: 'green',
    },
    preferenceIsMoving: {
      party: 'teabagger'
    }
  });

  ok(!get(component, 'isMoving'), 'isMoving is set to false');
});

test('when preferenceMoveDirection is set to `previous` and isMoving is true send a reorder action', function() {
  expect(3);

  var actionCount = 0;

  var component = this.subject({
    isMoving: true,
    model: {
      index: 3
    },
    preferencesCount: 5,
    sendAction: function(actionName, actionValue) {
      actionCount++;
      if (actionCount === 1) {
        equal(actionName, 'reorder', 'the action name is correct');
        deepEqual(actionValue, expected, 'the action value is correct');
      }
    }
  });

  var expected = {
    partyIndex: 3,
    dropZoneIndex: 2
  };

  set(component, 'preferenceMoveDirection', 'previous');

  equal(get(component, 'preferenceMoveDirection'), null, 'the preferenceMoveDirection is set to `null`');
});

test('when preferenceMoveDirection is set to `after` and isMoving is true send a reorder action', function() {
  expect(3);

  var actionCount = 0;

  var component = this.subject({
    isMoving: true,
    model: {
      index: 3
    },
    preferencesCount: 5,
    sendAction: function(actionName, actionValue) {
      actionCount++;
      if (actionCount === 1) {
        equal(actionName, 'reorder', 'the action name is correct');
        deepEqual(actionValue, expected, 'the action value is correct');
      }
    }
  });

  var expected = {
    partyIndex: 3,
    dropZoneIndex: 5
  };

  set(component, 'preferenceMoveDirection', 'after');

  equal(get(component, 'preferenceMoveDirection'), null, 'the preferenceMoveDirection is set to `null`');
});

test('when preferenceMoveDirection is set to `previous` and the party index is 1 dont fire an action', function() {
  expect(1);

  var component = this.subject({
    isMoving: true,
    model: {
      index: 1
    },
    preferencesCount: 5,
    sendAction: function(actionName, actionValue) {
      ok(false, 'no action is fired');
    }
  });

  set(component, 'preferenceMoveDirection', 'previous');

  equal(get(component, 'preferenceMoveDirection'), null, 'the preferenceMoveDirection is set to `null`');
});

test('when preferenceMoveDirection is set to `after` and the party index is the 1 less than the preferencesCount dont fire an action', function() {
  expect(1);

  var component = this.subject({
    isMoving: true,
    model: {
      index: 4
    },
    preferencesCount: 5,
    sendAction: function(actionName, actionValue) {
      ok(false, 'no action is fired');
    }
  });

  set(component, 'preferenceMoveDirection', 'after');

  equal(get(component, 'preferenceMoveDirection'), null, 'the preferenceMoveDirection is set to `null`');
});

test('when preferenceMoveDirection changes and the current component is not the component that is moving do not fire an action', function() {
  expect(1);

  var component = this.subject({
    model: {
      party: 'teabagger',
      index: 3
    },
    preferencesCount: 5,
    sendAction: function(actionName, actionValue) {
      ok(false, 'no action is fired');
    }
  });

  set(component, 'preferenceMoveDirection', 'after');

  equal(get(component, 'preferenceMoveDirection'), null, 'the preferenceMoveDirection is set to `null`');
});

test('when the preferenceDirection changes and the new position is at the beginning fire the partyAtBeginning action', function() {
  expect(1);

  var actionCount = 0;

  var component = this.subject({
    isMoving: true,
    model: {
      index: 2
    },
    preferencesCount: 5,
    sendAction: function(actionName, actionValue) {
      actionCount++;
      if (actionCount === 2) {
        equal(actionName, 'partyAtBeginning', 'the action name is correct');
      }
    }
  });

  set(component, 'preferenceMoveDirection', 'previous');
});

test('when the preferenceDirection changes and the new position is at the end fire the partyAtEnd action', function() {
  expect(1);

  var actionCount = 0;

  var component = this.subject({
    isMoving: true,
    model: {
      index: 3
    },
    preferencesCount: 5,
    sendAction: function(actionName, actionValue) {
      actionCount++;
      if (actionCount === 2) {
        equal(actionName, 'partyAtEnd', 'the action name is correct');
      }
    }
  });

  set(component, 'preferenceMoveDirection', 'after');
});

test('when the preferenceDirection changes and the new position is in the middle fire the partyAtMiddle action', function() {
  expect(1);

  var actionCount = 0;

  var component = this.subject({
    isMoving: true,
    model: {
      index: 2
    },
    preferencesCount: 5,
    sendAction: function(actionName, actionValue) {
      actionCount++;
      if (actionCount === 2) {
        equal(actionName, 'partyAtMiddle', 'the action name is correct');
      }
    }
  });

  set(component, 'preferenceMoveDirection', 'after');
});

test('preferenceClicked action toggles the value of isActive', function() {
  expect(2);
  var component = this.subject({
    isActive: false
  });

  component.send('preferenceClicked');
  ok(get(component, 'isActive'), 'isActive is set correctly');

  component.send('preferenceClicked');
  ok(!get(component, 'isActive'), 'isActive is set correctly');
});

test('preferenceClicked action sends the action preferenceDoneMoving when isActive is true', function() {
  expect(1);

  var component = this.subject({
    isActive: true,
    sendAction: function(actionName) {
      equal(actionName, 'preferenceDoneMoving', 'the preferenceDoneMoving action is fired');
    }
  });

  component.send('preferenceClicked');
});

test('preferenceClicked action sets isMoving to true and sends an action with party', function() {
  expect(3);

  var actionCount = 0;

  var component = this.subject({
    _window: { navigator: { platform: 'iPad' } },
    model: {
      party: 'teabagger',
      index: 3
    },
    isMoving: false,
    sendAction: function(actionName, actionValue) {
      actionCount++;
      if (actionCount === 1) {
        equal(actionName, 'wasClicked', 'the action name is correct');
        equal(actionValue, 'teabagger', 'the action value is correct');
      }
    }
  });

  component.send('preferenceClicked');

  ok(get(component, 'isMoving'), 'isMoving is set to true');
});

test('preferenceClicked action does not set isMoving to true when it model.index is 0', function() {
  expect(1);

  var component = this.subject({
    _window: { navigator: { platform: 'iPad' } },
    model: {
      party: 'teabagger',
      index: 0
    }
  });

  component.send('preferenceClicked');

  ok(!get(component, 'isMoving'), 'isMoving is false');
});

test('preferenceClicked action fires the partyAtBeginning action when model.index is 1', function() {
  expect(1);
  var actionCount = 0;

  var component = this.subject({
    _window: { navigator: { platform: 'iPad' } },
    model: {
      index: 1
    },
    sendAction: function(action) {
      actionCount++;
      if (actionCount === 2) {
        equal(action, 'partyAtBeginning', 'the action name is correct');
      }
    }
  });

  component.send('preferenceClicked');
});

test('preferenceClicked action fires the partyAtEnd action when model.index is equal to the preferencesCount', function() {
  expect(1);
  var actionCount = 0;

  var component = this.subject({
    _window: { navigator: { platform: 'iPad' } },
    model: {
      index: 5
    },
    preferencesCount: 6,
    sendAction: function(action) {
      actionCount++;
      if (actionCount === 2) {
        equal(action, 'partyAtEnd', 'the action name is correct');
      }
    }
  });

  component.send('preferenceClicked');
});

test('preferenceClicked action fires the partyAtMiddle action when model.index is between preferencesCount and 1', function() {
  expect(1);
  var actionCount = 0;

  var component = this.subject({
    _window: { navigator: { platform: 'iPad' } },
    model: {
      index: 3
    },
    preferencesCount: 6,
    sendAction: function(action) {
      actionCount++;
      if (actionCount === 2) {
        equal(action, 'partyAtMiddle', 'the action name is correct');
      }
    }
  });

  component.send('preferenceClicked');
});
