import { test, moduleForComponent } from 'ember-qunit';
import Ember                        from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('preference-order-control');

test('movePreferenceBefore action forwards the action', function() {
  expect(1);

  var component = this.subject({
    sendAction: function(actionName) {
      equal(actionName, 'movePreferenceBefore', 'the movePreferenceBefore action was fired');
    }
  });

  component.send('movePreferenceBefore');
});


test('movePreferenceAfter action forwards the action', function() {
  expect(1);

  var component = this.subject({
    sendAction: function(actionName) {
      equal(actionName, 'movePreferenceAfter', 'the movePreferenceAfter action was fired');
    }
  });

  component.send('movePreferenceAfter');
});
