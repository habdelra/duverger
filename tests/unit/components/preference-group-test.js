import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;

moduleForComponent('preference-group');

test('primaryPrefernce returns the first party in the preferences array', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: [],
    preferences: ['one', 'two']
  });

  equal(get(component, 'primaryPreference'), 'one', 'the correct preference is returned');
});

test('primaryPrefernceParty returns the party object from the primaryPreference property', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: [],
    primaryPreference: {
      party: 'green',
      gooch: 'punch'
    }
  });

  equal(get(component, 'primaryPreferenceParty'), 'green', 'the correct property is returned');
});

test('_reindexChildren sets the index property on all the preferences array items', function() {
  expect(1);

  var expected = [{
    color: 'green',
    index: 0
  },{
    color: 'blue',
    index: 1
  },{
    color: 'orange',
    index: 2
  }];

  var component = this.subject({
    preferenceGroup: [],
    preferences: [{ color: 'green' }, { color: 'blue' }, { color: 'orange' }]
  });

  component._reindexChildren();
  deepEqual(get(component, 'preferences'), expected, 'the preferences array was re-indexed');
});

test('dragStarted action sets isDragging to true', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: []
  });

  component.send('dragStarted');
  ok(get(component, 'isDragging'), 'isDragging is set to true');
});

test('dragEnded action sets isDragging to false', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: [],
    isDragging: true
  });

  component.send('dragEnded');
  ok(!get(component, 'isDragging'), 'isDragging is set to false');
});

test('reorder action moves a preference that appears after its specified drop zone into the position designated by the drop zone', function() {
  expect(2);

  var preferences = [{ postion: 0 }, { position: 1 }, { position: 2 }, { position: 3 }];
  var expected =  [{
    postion: 0,
    index: 0
  },{
    position: 3,
    index: 1
  },{
    position: 1,
    index: 2
  },{
    position: 2,
    index: 3
  }];

  var component = this.subject({
    preferenceGroup: [],
    preferences: preferences,
    sendAction: function(actionName) {
      equal(actionName, 'recalculateElectionOutcome', 'the recalculateElectionOutcome action was invoked');
    }
  });

  component.send('reorder', { dropZoneIndex: 1, partyIndex: 3 });
  deepEqual(get(component, 'preferences'), expected, 'the preference ordering is correct');
});

test('reorder action moves a preference that appears before its specified drop zone into the position designated by the drop zone', function() {
  expect(2);

  var preferences = [{ postion: 0 }, { position: 1 }, { position: 2 }, { position: 3 }];
  var expected =  [{
    postion: 0,
    index: 0
  },{
    position: 2,
    index: 1
  },{
    position: 3,
    index: 2
  },{
    position: 1,
    index: 3
  }];

  var component = this.subject({
    preferenceGroup: [],
    preferences: preferences,
    sendAction: function(actionName) {
      equal(actionName, 'recalculateElectionOutcome', 'the recalculateElectionOutcome action was invoked');
    }
  });

  component.send('reorder', { dropZoneIndex: 4, partyIndex: 1 });
  deepEqual(get(component, 'preferences'), expected, 'the preference ordering is correct');
});
