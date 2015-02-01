import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart, navigateToMajorityRunoff, navigateToMajority;
var run = Ember.run;
var keys = Ember.keys;
var emberA = Ember.A;

var originalRandomFunction;

var preferenceGroupSelector = '.preference-group';
var inputSelector = '.vote-input';
var runoffSelector = '.election-nav-btn';
var coinTossSelector = '.coin-toss';
var winnerSelector = '.party-winner:eq(0)';
var coinTossParticipantSelector = '.coin-toss-participant';
var coinTossWinnerSelector = '.coin-toss-winner';
var coinTossPanelSelector = '.coin-toss-panel';
var modalMaskSelector = '#modal';
var dropZoneSelector = '.preference-group.green .preference-drop-zone';

function dragThirdPreferencePartyInGreenGroupToSecondPosition() {
  triggerEvent(dropZoneSelector, 'drop', {
    dataTransfer: {
      types: {
        contains: function() {
          return true;
        }
      },
      getData: function() {
        return '{ "index": 2, "party": "liberal" }';
      }
    }
  });
}

function assertCoinTossPanelPresent() {
  var panel = find(coinTossPanelSelector);
  ok(panel.length, 'the coin toss panel is present');
}

function assertCoinTossPanelNotPresent() {
  var panel = find(coinTossPanelSelector);
  ok(!panel.length, 'the coin toss panel is not present');
}

function assertCoinTossIconPresent() {
  var cointToss = find(coinTossSelector);
  ok(cointToss.length, 'the coin toss icon is displayed');
}

function assertNoCoinTossIconPresent() {
  var cointToss = find(coinTossSelector);
  ok(!cointToss.length, 'the coin toss icon is not displayed');
}

function assertCoinTossParticipants(participantParties) {
  return function() {
    participantParties.forEach(function(participantParty){
      var participant = find(coinTossParticipantSelector + '.' + participantParty);
      ok(participant.length, 'the coin toss participant party `' + participantParty + '` exists');
    });
  };
}

function assertCoinTossWinners(winnerParties) {
  return function() {
    winnerParties.forEach(function(winnerParty){
      var winner = find(coinTossWinnerSelector + '.' + winnerParty);
      ok(winner.length, 'the coin toss winner party `' + winnerParty + '` exists');
    });
  };
}

function setVoterAmounts(voterAmounts) {
  return function() {
    var parties = keys(voterAmounts);
    parties.forEach(function(party){
      var amount = voterAmounts[party];
      var preferenceGroup = find(preferenceGroupSelector + '.' + party);
      var input = preferenceGroup.find(inputSelector);
      fillIn(input, voterAmounts[party]);
    });
  };
}

function clickOnModalMask() {
  return click(modalMaskSelector);
}

function clickOnWinner() {
  return click(winnerSelector);
}

function clickRunoffButton() {
  return click(runoffSelector);
}

module('Integration - Coin Toss', {
  setup: function() {
    App = startApp();
    navigateToMajorityRunoff = App.testHelpers.navigateToMajorityRunoff;
    navigateToMajority = App.testHelpers.navigateToMajority;
    originalRandomFunction = Math.random;
    //need to fake randomness so that we can make deterministic assertions in the tests
    Math.random = function() {
      return 0;
    };
  },
  teardown: function() {
    Math.random = originalRandomFunction;
    run(App, 'destroy');
  }
});

test('shows a coin toss icon when there is a coin toss', function() {
  expect(3);

  navigateToMajority('/')
    .then(assertNoCoinTossIconPresent)
    .then(setVoterAmounts({ socialDemocrat: 10,
                            liberal: 10,
                            nationalist: 10,
                            green: 0,
                            conservative: 0 }))
    .then(assertCoinTossIconPresent)
    .then(clickRunoffButton)
    .then(assertNoCoinTossIconPresent);
});

test('clicking on the modal mask hides the coin toss panel', function() {
  expect(2);

  navigateToMajority('/')
    .then(setVoterAmounts({ socialDemocrat: 10,
                            liberal: 10,
                            nationalist: 10,
                            green: 0,
                            conservative: 0 }))
    .then(clickOnWinner)
    .then(assertCoinTossPanelPresent)
    .then(clickOnModalMask)
    .then(assertCoinTossPanelNotPresent);
});

test('shows coin toss panel when the coin toss icon is clicked', function() {
  expect(6);

  navigateToMajority('/')
    .then(setVoterAmounts({ socialDemocrat: 10,
                            liberal: 10,
                            nationalist: 10,
                            green: 10,
                            conservative: 0 }))
    .then(dragThirdPreferencePartyInGreenGroupToSecondPosition)
    .then(assertCoinTossPanelNotPresent)
    .then(clickOnWinner)
    .then(assertCoinTossPanelPresent)
    .then(assertCoinTossParticipants(['green', 'socialDemocrat']))
    .then(assertCoinTossWinners(['liberal', 'nationalist']));
});

test('coin toss panel updates in runoff election', function() {
  expect(4);

  navigateToMajority('/')
    .then(setVoterAmounts({ socialDemocrat: 10,
                            liberal: 10,
                            nationalist: 10,
                            green: 10,
                            conservative: 0 }))
    .then(dragThirdPreferencePartyInGreenGroupToSecondPosition)
    .then(clickOnWinner)
    .then(assertCoinTossPanelPresent)
    .then(clickRunoffButton)
    .then(assertCoinTossPanelPresent)
    .then(assertCoinTossParticipants(['liberal']))
    .then(assertCoinTossWinners(['nationalist']));
});
