import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('donut-chart');

test('overallVoteTotal returns the sum of all the votes', function() {
  expect(1);

  var component = this.subject({
    voterSummary: [{
      democrats: 10
    },{
      republicants: 20
    },{
      teaParty: 100000
    }]
  });

  equal(get(component, 'overallVoteTotal'), 100030, 'the overallVoteTotal is correct');
});

test('the radius returns half of the diameter', function() {
  expect(1);

  var component = this.subject({
    diameter: 10
  });

  equal(get(component, 'radius'), 5, 'the radius is correct');
});

test('the outerRadius is the radius - the donutMargin', function() {
  expect(1);

  var component = this.subject({
    radius: 200
  });

  equal(get(component, 'outerRadius'), 140, 'the outerRadius is correct');
});

test('the innerRadius is the radius - the donut margin - the donut thickness', function() {
  expect(1);

  var component = this.subject({
    radius: 300
  });

  equal(get(component, 'innerRadius'), 153, 'the innerRadius is correct');
});
