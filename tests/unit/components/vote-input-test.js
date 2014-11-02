import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('vote-input');

test('calls incrementVoterAmount on up and right arrow', function() {
  expect(2);

  var component = this.subject({
    sendAction: function(action) {
      equal(action, 'incrementVoterAmount', 'calls incrementVoterAmount');
    }
  });

  component.keyDown({ keyCode: 38 }); // up
  component.keyDown({ keyCode: 39 }); // right
});

test('calls decrementVoterAmount on down and left arrow', function() {
  expect(2);

  var component = this.subject({
    sendAction: function(action) {
      equal(action, 'decrementVoterAmount', 'calls decrementVoterAmount');
    }
  });

  component.keyDown({ keyCode: 37 }); // left
  component.keyDown({ keyCode: 40 }); // down
});
