import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('donut-hole');

test('radius is half of the diameter', function() {
  expect(1);

  var component = this.subject({
    diameter: 6
  });

  equal(get(component, 'radius'), 3, 'the radius is correct');
});

test('innerRadius is the radius - donutThickness - donut margin', function(){
  expect(1);

  var component = this.subject({
    radius: 300
  });

  equal(get(component, 'innerRadius'), 82, 'the innerRadius is correct');
});

test('style returns the CSS position of the donut hole', function() {
  expect(1);

  var component = this.subject({
    radius: 300
  });

  var expected = 'width:164px; height:164px; left:218px; top:218px;';
  equal(get(component, 'style'), expected, 'the style is correct');
});

test('viewRunoffElection sets the currentRunoff to 1', function() {
  expect(1);

  var component = this.subject();

  component.send('viewRunoffElection');
  equal(get(component, 'currentRunoff'), 1, 'the currentRunoff is correct');
});

test('viewCurrentElection sets the currentRunoff to 0', function() {
  expect(1);

  var component = this.subject();

  component.send('viewCurrentElection');
  equal(get(component, 'currentRunoff'), 0, 'the currentRunoff is correct');
});
