import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart;
var run = Ember.run;
var empty = Ember.empty;

var originalRandomFunction;

var electionOutcomeSelector = '.party-winner';
var formulaDisplaySelector = '.formula';
var formulaSelectSelector = '.formula select';
var formulaOptionsSelector = 'option';
var electionRoundButton = '.election-nav-btn';
var toggleFormulaListButtonSelector = '.toggle-formula-list-button';
var formulaButtonsSelector = '.select-formula-button';

function assertDropDownIsHidden() {
  var formulaButtons = find(formulaButtonsSelector);
  ok(!formulaButtons.length, 'formula buttons are not displayed');
}

function assertDropDownIsVisible() {
  var formulaButtons = find(formulaButtonsSelector);
  equal(formulaButtons.length, 2, 'two formula buttons are displayed');
}

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function showFormulaList() {
  return click(toggleFormulaListButtonSelector);
}

function selectFromDropDown(buttonIndex) {
  return function() {
    var formulaButtons = find(formulaButtonsSelector);
    return click(formulaButtons[buttonIndex]);
  };
}

function assertElectionNavButtonExists() {
  var button = find(electionRoundButton);
  ok(button.length, 'election navigation button exists');
}

function assertElectionNavButtonDoesntExist() {
  var button = find(electionRoundButton);
  ok(!button.length, 'election navigation button doesnt exist');
}

function assertElectionNavButtonDoesNotExist() {
  var button = find(electionRoundButton);
  ok(!button.length, 'election navigation button doesnt exist');
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

test('switch from plurality to majority and black', function() {
  expect(38);

  visit('/')
    .then(assertDropDownIsHidden)
    .then(showFormulaList)
    .then(assertDropDownIsVisible)
    .then(assertElectionNavButtonDoesntExist)
    .then(selectFromDropDown(1))
    .then(assertChartDisplay('majorityFirstRound'))
    .then(assertPartyWinners(['SD', 'G']))
    .then(assertElectionNavButtonExists)
    .then(showFormulaList)
    .then(selectFromDropDown(0))
    .then(assertChartDisplay('plurality'))
    .then(assertElectionNavButtonDoesntExist)
    .then(assertPartyWinners(['SD']));
});

