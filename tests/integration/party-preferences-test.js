import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart, navigateToMajorityRunoff;
var run = Ember.run;

var originalRandomFunction;

var liberalGroupPartyPreference = '.preference-group.liberal .party-preference';
var dropZoneSelector = '.preference-group.liberal .preference-drop-zone';
var electionOutcomeSelector = '.party-winner';

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function dragFourthPreferencePartyInLiberalGroupToSecondPosition() {
  triggerEvent(dropZoneSelector, 'drop', {
    dataTransfer: {
      types: {
        contains: function() {
          return true;
        }
      },
      getData: function() {
        return '{ "index": 3, "party": "green" }';
      }
    }
  });
}

function assertPartyWinners(partyWinners) {
  return function() {
    var outcome = find(electionOutcomeSelector);
    equal(outcome.length, partyWinners.length, 'there is ' + partyWinners.length +' election winner');
    partyWinners.forEach(function(winner, i){
      equal(find(outcome[i]).text().trim(), winner, 'the correct winner is displayed');
    });
  };
}

function assertLiberalGroupsNewPreferences(expectedOrder) {
  return function() {
    var partyPreferences = find(liberalGroupPartyPreference);
    equal(partyPreferences.length, 5, 'the correct number of preferences are displayed');

    for (var i = 1; i < partyPreferences.length; i++) { //skip the primary preference
      var partyPreference = find(partyPreferences[i]);
      equal(partyPreference.text().trim(), expectedOrder[i - 1], 'the party preference is in the correct order');
    }
  };
}

module('Integration - Party Preferences', {
  setup: function() {
    App = startApp();
    navigateToMajorityRunoff = App.testHelpers.navigateToMajorityRunoff;
    assertChart = App.testHelpers.assertChart;
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

test('rearrange preferences that do not effect the donut graph', function() {
  expect(44);

  visit('/')
    .then(assertChartDisplay('majorityFirstRound'))
    .then(assertLiberalGroupsNewPreferences(['SD', 'C', 'G', 'N']))
    .then(assertPartyWinners(['SD', 'G']))
    .then(dragFourthPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['SD', 'G']))
    .then(assertLiberalGroupsNewPreferences(['G', 'SD', 'C', 'N']))
    .then(assertChartDisplay('majorityFirstRound'));
});

test('rearrange preferences that effect donut graph', function(){
  expect(46);

  navigateToMajorityRunoff('/')
    .then(assertChartDisplay('majorityRunoff'))
    .then(dragFourthPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['SD']))
    .then(assertChartDisplay('majorityRunoffPreferenceChange'))
    .then(dragFourthPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['SD']))
    .then(assertChartDisplay('majorityRunoff'));
});
