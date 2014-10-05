import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('left-hand-panel');

test('toggleLeftHandPanel action toggles isOpened', function() {
  expect(3);

  var component = this.subject();

  equal(get(component, 'isOpened'), true, 'isOpened is true');

  component.send('toggleLeftHandPanel');

  equal(get(component, 'isOpened'), false, 'isOpened is false');

  component.send('toggleLeftHandPanel');

  equal(get(component, 'isOpened'), true, 'isOpened is true');
});
