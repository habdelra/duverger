import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart, navigateToMajorityRunoff;
var run = Ember.run;

var liberalGroupPartyPreference = '.preference-group.liberal .party-preference';
var dropZoneSelector = '.preference-group.liberal .preference-drop-zone';
var electionOutcomeSelector = '.party-winner';

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function dragThirdPreferencePartyInLiberalGroupToSecondPosition() {
  triggerEvent(dropZoneSelector, 'drop', {
    dataTransfer: {
      types: {
        contains: function() {
          return true;
        }
      },
      getData: function() {
        return '{ "index": 2, "party": "conservative" }';
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
    assertChart= App.testHelpers.assertChart;
  },
  teardown: function() {
    run(App, 'destroy');
  }
});

test('rearrange preferences that do not effect the donut graph', function() {
  expect(44);

  visit('/')
    .then(assertChartDisplay('majorityFirstRound'))
    .then(assertLiberalGroupsNewPreferences(['SD', 'C', 'G', 'N']))
    .then(assertPartyWinners(['Social Democrat (SD)', 'Conservative (C)']))
    .then(dragThirdPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['Social Democrat (SD)', 'Conservative (C)']))
    .then(assertLiberalGroupsNewPreferences(['C', 'SD', 'G', 'N']))
    .then(assertChartDisplay('majorityFirstRound'));
});

test('rearrange preferences that effect donut graph', function(){
  expect(46);

  navigateToMajorityRunoff('/')
    .then(assertChartDisplay('majorityRunoff'))
    .then(dragThirdPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['Social Democrat (SD)']))
    .then(assertChartDisplay('majorityRunoffPreferenceChange'))
    .then(dragThirdPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['Social Democrat (SD)']))
    .then(assertChartDisplay('majorityRunoff'));
});
