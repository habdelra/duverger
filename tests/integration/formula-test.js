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

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function selectFromDropDown(optionIndex) {
  return function() {
    var select  = find(formulaSelectSelector);
    var options = select.find(formulaOptionsSelector);
    var option  = find(options[optionIndex]);

    option.prop('selected', true);
    triggerEvent(select[0], 'change');
  };
}

function assertDropDownSelection(selectedOptionIndex) {
  return function() {
    var select  = find(formulaSelectSelector);
    var options = select.find(formulaOptionsSelector);
    var option  = find(options[selectedOptionIndex]);

    if (empty(selectedOptionIndex)) {
      for (var i = 0; i < options.length; i++) {
        if (i === 0) {
          ok(find(options[i]).prop('selected'), 'the option is selected');
        } else {
          ok(!find(options[i]).prop('selected'), 'the option is not selected');
        }
      }
    } else {
      ok(find(option).prop('selected'), 'the option is selected');
    }
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

test('switch from majority to plurality and black', function() {
  expect(36);

  visit('/')
    .then(selectFromDropDown(2))
    .then(assertDropDownSelection(2))
    .then(assertChartDisplay('plurality'))
    .then(assertPartyWinners(['SD']))
    .then(selectFromDropDown(1))
    .then(assertDropDownSelection(1))
    .then(assertChartDisplay('majorityFirstRound'))
    .then(assertPartyWinners(['SD', 'G']))
    .then(assertElectionNavButtonExists);
});

