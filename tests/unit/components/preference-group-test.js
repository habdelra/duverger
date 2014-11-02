import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('preference-group');

test('primaryPrefernce returns the first party in the preferences array', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {},
    preferences: ['one', 'two']
  });

  equal(get(component, 'primaryPreference'), 'one', 'the correct preference is returned');
});

test('primaryPrefernceParty returns the party object from the primaryPreference property', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {},
    primaryPreference: {
      party: 'green',
      gooch: 'punch'
    }
  });

  equal(get(component, 'primaryPreferenceParty'), 'green', 'the correct property is returned');
});

test('percentage returns the percentage of total voters that the preference group represents', function() {
  expect(2);

  var component = this.subject({
    preferenceGroup: {},
    totalVoters: 1000,
    voters: 104
  });

  equal(get(component, 'percentage'), 10.4, 'the correct percentage is returned');

  set(component, 'voters', 105);

  equal(get(component, 'percentage'), 10.5, 'the correct percentage is returned');
});

test('votersDisplay key/value computed get returns voters', function(){
  expect(1);

  var component = this.subject({
    preferenceGroup: {},
    voters: 2
  });

  equal(get(component, 'votersDisplay'), 2, 'votersDisplay is correct');
});

test('votersDisplay key/value computed set will set voters to 0 when it is Ember.empty', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {},
    voters: 2
  });

  set(component, 'votersDisplay', '');
  equal(get(component, 'voters'), 0, 'voters is set to 0');
});

test('votersDisplay key/value computed set will set voters to 0 when it is negative', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {},
    voters: 2
  });

  set(component, 'votersDisplay', '-10');
  equal(get(component, 'voters'), 0, 'voters is set to 0');
});

test('votersDisplay key/value computed set will set voters to 0 when it is not a number', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {},
    voters: 2
  });

  set(component, 'votersDisplay', '༼ ༎ຶ ෴ ༎ຶ༽');
  equal(get(component, 'voters'), 0, 'voters is set to 0');
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
    preferenceGroup: {},
    preferences: [{ color: 'green' }, { color: 'blue' }, { color: 'orange' }]
  });

  component._reindexChildren();
  deepEqual(get(component, 'preferences'), expected, 'the preferences array was re-indexed');
});

test('dragStarted action sets isDragging to true', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {},
  });

  component.send('dragStarted');
  ok(get(component, 'isDragging'), 'isDragging is set to true');
});

test('dragEnded action sets isDragging to false', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {},
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
    preferenceGroup: {},
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
    preferenceGroup: {},
    preferences: preferences,
    sendAction: function(actionName) {
      equal(actionName, 'recalculateElectionOutcome', 'the recalculateElectionOutcome action was invoked');
    }
  });

  component.send('reorder', { dropZoneIndex: 4, partyIndex: 1 });
  deepEqual(get(component, 'preferences'), expected, 'the preference ordering is correct');
});

test('the decrementVoterAmount action decreases voters by 1', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {
      voters: 10
    }
  });

  component.send('decrementVoterAmount');

  equal(get(component, 'voters'), 9, 'the voters is correct');
});

test('the decrementVoterAmount action does not decrease voters when voters is 0', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {
      voters: 0
    }
  });

  component.send('decrementVoterAmount');

  equal(get(component, 'voters'), 0, 'the voters is correct');
});

test('the incrementVoterAmount action increases voters by 1', function() {
  expect(1);

  var component = this.subject({
    preferenceGroup: {
      voters: 10
    }
  });

  component.send('incrementVoterAmount');

  equal(get(component, 'voters'), 11, 'the voters is correct');
});

test('when wasClicked action is received set the preferenceIsMoving value', function() {
  expect(1);

  var component = this.subject({
    $: function() {
      return {
        offset: Ember.K,
        height: Ember.K,
        width: Ember.K
      };
    },
    preferenceGroup: {},
    preferences: [{
      party: 'teabagger'
    },{
      party: 'green'
    }]
  });

  var expected = {
    primaryParty: 'teabagger',
    party: 'rentIsTooDamnHigh'
  };

  component.send('wasClicked', 'rentIsTooDamnHigh');

  deepEqual(get(component, 'preferenceIsMoving'), expected, 'the preferenceIsMoving value is correct');
});

test('when wasClicked action is received, the preferenceOrderStyle is set', function() {
  expect(1);

  var component = this.subject({
    $: function() {
      return {
        offset: function() {
          return {
            top: 100,
            left: 50
          };
        },
        height: function() {
          return 200;
        },
        width: function() {
          return 300;
        }
      };
    },
    preferenceGroup: {}
  });

  var expected = 'top:205px; left:240px;';

  component.send('wasClicked', 'rentIsTooDamnHigh');

  equal(get(component, 'preferenceOrderStyle'), expected, 'the preferenceOrderStyle value is correct');
});

test('forward partyAtBeginning action', function() {
  expect(1);

  var component = this.subject({
    sendAction: function(actionName) {
      equal(actionName, 'partyAtBeginning', 'the actionName is correct');
    }
  });

  component.send('partyAtBeginning');
});

test('forward partyAtMiddle action', function() {
  expect(1);

  var component = this.subject({
    sendAction: function(actionName) {
      equal(actionName, 'partyAtMiddle', 'the actionName is correct');
    }
  });

  component.send('partyAtMiddle');
});

test('forward partyAtEnd action', function() {
  expect(1);

  var component = this.subject({
    sendAction: function(actionName) {
      equal(actionName, 'partyAtEnd', 'the actionName is correct');
    }
  });

  component.send('partyAtEnd');
});
