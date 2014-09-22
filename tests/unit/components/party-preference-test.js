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

test('votersDisplay key/value computed get returns voters', function(){
  expect(1);

  var component = this.subject({
    voters: 2
  });

  equal(get(component, 'votersDisplay'), 2, 'votersDisplay is correct');
});

test('votersDisplay key/value computed set will set voters to 0 when it is Ember.empty', function() {
  expect(1);

  var component = this.subject({
    voters: 2
  });

  set(component, 'votersDisplay', '');
  equal(get(component, 'voters'), 0, 'voters is set to 0');
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
