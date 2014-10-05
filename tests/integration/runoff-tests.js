import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart;
var run = Ember.run;

var originalRandomFunction;

var runoffSelector = '.election-nav-btn.view-runoff';
var electionOutcomeSelector = '.party-winner';
var electionRoundButton = '.election-nav-btn';


function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function clickRunoffButton() {
  return click(runoffSelector);
}

function assertElectionNavigationButton(display) {
  return function(){
    var button = find(electionRoundButton);
    equal(button.text().trim(), display, 'election navigation button display is correct: ' + display);
  };
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

module('Integration - Runnoffs', {
  setup: function() {
    App = startApp();
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

test('switch from first round test to runoff and back', function() {
  expect(20);

  visit('/')
    .then(assertChartDisplay('majorityFirstRound'))
    .then(assertPartyWinners(['SD', 'C']))
    .then(assertElectionNavigationButton('View Runoff Results'))
    .then(clickRunoffButton)
    .then(assertChartDisplay('majorityRunoff'))
    .then(assertPartyWinners(['SD']))
    .then(assertElectionNavigationButton('View Original Election Results'))
    .then(clickRunoffButton)
    .then(assertChartDisplay('majorityFirstRound'))
    .then(assertPartyWinners(['SD', 'C']))
    .then(assertElectionNavigationButton('View Runoff Results'));
});
