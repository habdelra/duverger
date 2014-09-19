import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('party-drop-zone');

test('index returns model.index + 1', function() {
  expect(1);

  var component = this.subject({
    model: {
      index: 1
    }
  });

  equal(get(component, 'index'), 2, 'the index value is correct');
});

test('the mimetype is set based on the primaryPreference party', function() {
  expect(1);

  var component = this.subject({
    primaryPreference: {
      party: 'green'
    }
  });

  equal(get(component, 'mimeType'), 'text/x-preference-green', 'the mime type is correct');
});

test('validateDragEvent returns event.dataTransfer.types.contains()', function() {
  expect(2);

  var event = {
    dataTransfer: {
      types: {
        contains: function(mimeType) {
          equal(mimeType, 'expectedMimeType', 'the mimetype is correct');
          return 'cheese';
        }
      }
    }
  };

  var component = this.subject({
    mimeType: 'expectedMimeType'
  });

  var result = component.validateDragEvent(event);
  equal(result, 'cheese', 'the result of validateDragEvent is correct');
});

test('acceptDrop sends the reorder action', function(){
  expect(3);

  var event = {
    dataTransfer: {
      getData: function(mimeType){
        equal(mimeType, 'expectedMimeType', 'the mimetype is correct');
        return '{"index":3}';
      }
    }
  };

  var expectedActionArgument = {
    partyIndex: 3,
    dropZoneIndex: 1
  };

  var component = this.subject({
    index: 1,
    mimeType: 'expectedMimeType',
    sendAction: function(actionName, actionArgument) {
      equal(actionName, 'reorder', 'the action name is correct');
      deepEqual(actionArgument, expectedActionArgument, 'the action argument is correct');
    }
  });

  component.acceptDrop(event);
});
