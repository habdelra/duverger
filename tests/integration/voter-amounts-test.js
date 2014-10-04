import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart, navigateToMajorityRunoff, navigateToPlurality;
var run = Ember.run;
var keys = Ember.keys;

var preferenceGroupSelector = '.preference-group';
var inputSelector = '.vote-input';
var electionOutcomeSelector = '.party-winner';
var dropZoneSelector = '.preference-group.liberal .preference-drop-zone';
var tieSelector = '.election-outcome';
var runoffSelector = '.election-nav-btn.view-runoff';

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function clickRunoffButton() {
  return click(runoffSelector);
}

function assertTie() {
  var electionOutcome = find(tieSelector);
  ok(electionOutcome.text().trim().indexOf('Unresolveable Tie') > -1, 'Tie message displayed');
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

module('Integration - Voter Amounts', {
  setup: function() {
    App = startApp();
    assertChart = App.testHelpers.assertChart;
    navigateToMajorityRunoff = App.testHelpers.navigateToMajorityRunoff;
    navigateToPlurality = App.testHelpers.navigateToPlurality;
  },
  teardown: function() {
    run(App, 'destroy');
  }
});

test('changing the voter amount updates the chart in primary election and results in runoff election', function() {
  expect(17);

  visit('/')
    .then(setVoterAmounts({ socialDemocrat: 60 }))
    .then(assertChartDisplay('majorityFirstRoundSD60'))
    .then(assertPartyWinners(['Social Democrat (SD)', 'Conservative (C)']));
});

test('changing the voter amount updates the chart in primary election and does not result in runoff election', function() {
  expect(16);

  visit('/')
    .then(setVoterAmounts({ socialDemocrat: 80 }))
    .then(assertChartDisplay('majorityFirstRoundSD80'))
    .then(assertPartyWinners(['Social Democrat (SD)']));
});

test('changing the voter amount updates the chart in runoff election', function() {
  expect(16);

  navigateToMajorityRunoff('/')
    .then(setVoterAmounts({ socialDemocrat: 60 }))
    .then(assertChartDisplay('majorityRunoffSD60'))
    .then(assertPartyWinners(['Social Democrat (SD)']));
});

test('changing the voter amount updates the chart in runoff election to a result that does not require a runoff election', function() {
  expect(16);

  navigateToMajorityRunoff('/')
    .then(setVoterAmounts({ socialDemocrat: 80 }))
    .then(assertChartDisplay('majorityFirstRoundSD80'))
    .then(assertPartyWinners(['Social Democrat (SD)']));
});


test('changing the voter amount updates the chart that was previously altered by changing party preferences', function() {
  expect(16);

  navigateToMajorityRunoff('/')
    .then(dragThirdPreferencePartyInLiberalGroupToSecondPosition)
    .then(setVoterAmounts({ socialDemocrat: 60 }))
    .then(assertChartDisplay('majorityRunoffPreferenceChangeSD60'))
    .then(assertPartyWinners(['Social Democrat (SD)']));
});

test('changing the voter amounts results in an unresolvable tie in the runoff', function(){
  expect(15);

  visit('/')
    .then(setVoterAmounts({
      socialDemocrat: 30,
      liberal: 0,
      nationalist: 0,
      green: 0,
      conservative: 30
    }))
    .then(clickRunoffButton)
    .then(assertChartDisplay('majorityRunoffSD30L0N0G0C30'))
    .then(assertTie);
});

test('changing the voter amount updates the chart using the plurality formula', function() {
  expect(16);

  visit('/')
    .then(navigateToPlurality)
    .then(setVoterAmounts({ socialDemocrat: 60 }))
    .then(assertChartDisplay('pluralitySD60'))
    .then(assertPartyWinners(['Social Democrat (SD)']));
});

test('changing the voter amounts results in a tie in the plurality formula', function() {
  expect(15);

  visit('/')
    .then(setVoterAmounts({
      socialDemocrat: 30,
      liberal: 0,
      nationalist: 0,
      green: 0,
      conservative: 30
    }))
    .then(navigateToPlurality)
    .then(assertChartDisplay('pluralitySD30L0N0G0C30'))
    .then(assertTie);
});

