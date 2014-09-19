import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart;
var run = Ember.run;

var electionOutcomeSelector = '.party-winner';
var formulaButtonSelector = '.formula-btn';
var formulaDisplaySelector = '.formula';
var electionRoundButton = '.election-nav-btn';

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function clickFormulaButton(formula) {
  return function() {
    var button = find(formulaButtonSelector + '.' + formula);
    return click(button);
  };
}

function assertElectionNavButtonExists() {
  var button = find(electionRoundButton);
  ok(button.length, 'election navigation button exists');
}

function assertElectionNavButtonDoesNotExist() {
  var button = find(electionRoundButton);
  ok(!button.length, 'election navigation button doesnt exist');
}

function assertFormulaDisplay(formulaName) {
  return function() {
    var formula = find(formulaDisplaySelector);
    ok(formula.text().trim().indexOf(formulaName) > -1, 'the fomula display shows `' + formulaName + '`');
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

module('Integration - Formula', {
  setup: function() {
    App = startApp();
    assertChart = App.testHelpers.assertChart;
  },
  teardown: function() {
    run(App, 'destroy');
  }
});

test('switch from majority to plurality and black', function() {
  expect(37);

  visit('/')
    .then(clickFormulaButton('plurality'))
    .then(assertChartDisplay('plurality'))
    .then(assertPartyWinners(['Social Democrat (SD)']))
    .then(assertElectionNavButtonDoesNotExist)
    .then(assertFormulaDisplay('plurality'))
    .then(clickFormulaButton('majority'))
    .then(assertChartDisplay('majorityFirstRound'))
    .then(assertPartyWinners(['Social Democrat (SD)', 'Conservative (C)']))
    .then(assertElectionNavButtonExists)
    .then(assertFormulaDisplay('majority'));
});

