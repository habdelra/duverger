import Ember from 'ember';
import { test, moduleFor } from 'ember-qunit';
import ElectionOutcomeMixin from '../../../mixins/election-outcome';

var get = Ember.get;
var set = Ember.set;

module('mixin:election-outcome');

test('currentRunoff is initialied to 0', function() {
  expect(1);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin);

  equal(get(object, 'currentRunoff'), 0, 'the currentRunoff is initialized ot 0');
});

test('electionOutcomeForCurrentRunoff returns an object from the electionOutcome array with the index of the currentRunoff', function(){
  expect(2);

  var expectedOutcome1 = 'George W. Bush';
  var expectedOutcome2 = 'Barak Obama';

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    electionOutcome : [ expectedOutcome1, expectedOutcome2 ]
  });

  set(object, 'currentRunoff', 1);
  equal(get(object, 'electionOutcomeForCurrentRunoff'), expectedOutcome2, 'the election outcome is correct');

  set(object, 'currentRunoff', 0);
  equal(get(object, 'electionOutcomeForCurrentRunoff'), expectedOutcome1, 'the election outcome is correct');
});

test('electionOutcomeForCurrentRunoff returns the first object when the currentRunoff is larger than the electionOutcome array', function(){
  expect(1);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    electionOutcome : [ 'Barak Obama' ]
  });

  set(object, 'currentRunoff', 1);
  equal(get(object, 'electionOutcomeForCurrentRunoff'), 'Barak Obama', 'the election outcome is correct');
});

test('the voterSummary is an array sorted aphabetically by the enclosed object`s only property name', function(){
  expect(1);

  var unsortedVoterSummary = [{
    socialDemocrat: 9
  },{
    conservative: 2
  },{
    green: 1
  },{
    nationalist: 2
  }];

  var expected = [{
    conservative: 2
  },{
    green: 1
  },{
    nationalist: 2
  },{
    socialDemocrat: 9
  }];

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    electionOutcomeForCurrentRunoff: {
      voterSummary: unsortedVoterSummary
    }
  });

  deepEqual(get(object, 'voterSummary'), expected, 'the voter summary is sorted correctly');
});

test('hasWinner is true when the winners array length is 1', function(){
  expect(2);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    winners: ['democrat']
  });

  ok(get(object, 'hasWinner'), 'hasWinner is correct');

  set(object, 'winners', ['democrat', 'republican']);
  ok(!get(object, 'hasWinner'), 'hasWinner is correct');
});

test('displayParties retuns an array of objects that has display properties for each party in the winners array', function(){
  expect(1);

  var expected = [{
    name: 'green',
    fullName: 'Green',
    abbreviation: 'G',
    index: 0,
    color: '#BBDF2A'
  },{
    name: 'nationalist',
    abbreviation: 'N',
    index: 1,
    fullName: 'Nationalist',
    color: '#46C8B3'
  }];

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    winners: ['green', 'nationalist']
  });

  deepEqual(get(object, 'displayParties'), expected, 'the display winners array is correct');
});

test('requiresRunoff returns true when runoffs is greater than 0 and currentRunoff is less than runoffs - 1', function(){
  expect(2);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    runoffs: 2,
    currentRunoff: 0
  });

  ok(get(object, 'requiresRunoff'), 'requiresRunoff is true');

  set(object, 'currentRunoff', 1);
  ok(!get(object, 'requiresRunoff'), 'requiresRunoff is false');
});

test('winningParty returns the party when the winners array has only one item in it', function() {
  expect(3);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    winners: ['democrat']
  });

  equal(get(object, 'winningParty'), 'democrat', 'the winning party is correct');

  set(object, 'winners', ['democrat', 'republican']);
  equal(get(object, 'winningParty'), undefined, 'the winning party is `undefined`');

  set(object, 'winners', []);
  equal(get(object, 'winningParty'), undefined, 'the winning party is `undefined`');
});

test('winnerName returns the name of the winning party', function(){
  expect(1);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    winners: ['green']
  });

  equal(get(object, 'winnerName'), 'Green', 'the correct party name is returned');
});

test('winnerAbbreviation returns the abbreviation of the winning party', function(){
  expect(1);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    winners: ['green']
  });

  equal(get(object, 'winnerAbbreviation'), 'G', 'the correct party abbreviation is returned');
});

test('winnerColor returns the color of the winning party', function(){
  expect(1);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    winners: ['green']
  });

  equal(get(object, 'winnerColor'), '#BBDF2A', 'the correct party color is returned');
});

test('runoffOrdinal returns the english ordinal string based on the currentRunoff', function() {
  expect(4);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    currentRunoff: 0
  });

  equal(get(object, 'runoffOrdinal'), '1st', 'the ordinal value is correct');

  set(object, 'currentRunoff', 1);

  equal(get(object, 'runoffOrdinal'), '2nd', 'the ordinal value is correct');

  set(object, 'currentRunoff', 2);

  equal(get(object, 'runoffOrdinal'), '3rd', 'the ordinal value is correct');

  set(object, 'currentRunoff', 3);

  equal(get(object, 'runoffOrdinal'), '4th', 'the ordinal value is correct');
});

test('coinTossWinners returns an array of coin toss winners for the current run-off', function() {
  expect(1);

  var expected = ['socialDemocrat', 'green'];
  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    currentRunoff: 1,
    electionOutcome: [{
      coinToss: {
        participants: [],
        winners: []
      }
    }, {
      coinToss: {
        participants: ['socialDemocrat', 'green', 'liberal'],
        winners: expected
      }
    }]
  });

  deepEqual(get(object, 'coinTossWinners'), expected, 'coinTossWinners is correct');
});

test('coinTossParticipants returns an array of coin toss participants for the current run-off', function() {
  expect(1);

  var expected = ['socialDemocrat', 'green'];
  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    currentRunoff: 1,
    electionOutcome: [{
      coinToss: {
        participants: [],
        winners: []
      }
    }, {
      coinToss: {
        participants: expected,
        winners: ['green']
      }
    }]
  });

  deepEqual(get(object, 'coinTossParticipants'), expected, 'coinTossParticipants is correct');
});

test('coinTossHappened returns a false when a coin toss did not happen in the current run-off', function() {
  expect(1);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    currentRunoff: 1,
    electionOutcome: [{
      coinToss: {
        participants: ['green', 'liberal'],
        winners: ['green']
      }
    }, {
      coinToss: {
        participants: [],
        winners: []
      }
    }]
  });

  ok(!get(object, 'coinTossHappened'), 'coinTossHappened is the correct value');
});

test('coinTossHappened returns a true when a coin toss did happen in the current run-off', function() {
  expect(1);

  var object = Ember.Object.createWithMixins(ElectionOutcomeMixin, {
    currentRunoff: 0,
    electionOutcome: [{
      coinToss: {
        participants: ['green', 'liberal'],
        winners: ['green']
      }
    }, {
      coinToss: {
        participants: [],
        winners: []
      }
    }]
  });

  ok(get(object, 'coinTossHappened'), 'coinTossHappened is the correct value');
});
