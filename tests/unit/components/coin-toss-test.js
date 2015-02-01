import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('coin-toss');

test('parties computed returns an array of parties that participated in the coin toss with winners denoted', function() {
  expect(1);

  var component = this.subject({
    electionOutcome: [{
      coinToss: {
        participants: ['nationalist', 'green', 'liberal', 'conservative'],
        winners: ['liberal', 'conservative']
      }
    }],
    currentRunoff: 0
  });

  var expected = [{
    name: 'conservative',
    abbreviation: 'C',
    isWinner: true
  },{
    name: 'liberal',
    abbreviation: 'L',
    isWinner: true
  },{
    name: 'green',
    abbreviation: 'G',
    isWinner: false
  },{
    name: 'nationalist',
    abbreviation: 'N',
    isWinner: false
  }];

  deepEqual(get(component, 'parties'), expected, 'the parties array is correct');
});

test('showCoinToss computed returns true when visibleCoinTossIndex equals index and coinTossHappened is true', function() {
  expect(1);

  var component = this.subject({
    index: 0,
    visibleCoinTossIndex: 0,
    coinTossHappened: true
  });

  ok(get(component, 'showCoinToss'), 'showCoinToss value is correct');
});

test('showCoinToss computed returns false when visibleCoinTossIndex does not equals index and coinTossHappened is true', function() {
  expect(1);

  var component = this.subject({
    index: 0,
    visibleCoinTossIndex: 1,
    coinTossHappened: true
  });

  ok(!get(component, 'showCoinToss'), 'showCoinToss value is correct');
});

test('showCoinToss computed returns false when visibleCoinTossIndex equals index and coinTossHappened is false', function() {
  expect(1);

  var component = this.subject({
    index: 0,
    visibleCoinTossIndex: 0,
    coinTossHappened: false
  });

  ok(!get(component, 'showCoinToss'), 'showCoinToss value is correct');
});

test('showCoinToss computed returns false when visibleCoinTossIndex does not equals index and coinTossHappened is false', function() {
  expect(1);

  var component = this.subject({
    index: 0,
    visibleCoinTossIndex: 1,
    coinTossHappened: false
  });

  ok(!get(component, 'showCoinToss'), 'showCoinToss value is correct');
});
