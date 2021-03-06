import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart, navigateToMajority;
var run = Ember.run;
var originalRandomFunction;

var preferenceGroupSelector = '.preference-group';
var partyNameSelector = '.party-name';
var voterAmountSelector = '.vote-input';
var partyPreferenceSelector = '.party-preference';
var formulaValueSelector = '.formula__value option';
var districtValueSelector = '.district__value';
var donutSvgSelector = '.donut-chart svg';
var electionRunoffOutcomeSelector = '.party-winner.runoff';
var electionOutcomeSelector = '.party-winner';
var selectedFormulaSelector = '.selected-formula';

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function assertPluralityElectionOutcome() {
  var expectedWinners = ['SD'];
  var expectedWinnerClasses = ['socialDemocrat'];
  var outcome = find(electionOutcomeSelector);
  equal(outcome.length, 1, 'there is 1 election winner');

  for (var i = 0; i < outcome.length; i++) {
    var winner = find(outcome[i]);
    equal(winner.text().trim(), expectedWinners[i], 'the correct winner is displayed');
    ok(winner.hasClass(expectedWinnerClasses[i]), 'the class is correct');
  }
}

function assertMajorityElectionOutcome() {
  var expectedWinners = ['SD', 'G'];
  var expectedWinnerClasses = ['socialDemocrat', 'green'];
  var outcome = find(electionRunoffOutcomeSelector);
  equal(outcome.length, 2, 'there are 2 election winners');

  for (var i = 0; i < outcome.length; i++) {
    var winner = find(outcome[i]);
    equal(winner.text().trim(), expectedWinners[i], 'the correct winner is displayed');
    ok(winner.hasClass(expectedWinnerClasses[i]), 'the class is correct');
  }
}

function assertDefaultFormulaSelected() {
  var formula = find(selectedFormulaSelector);
  equal(formula.text(), 'plurality');
}

function assertDistrictDisplayed() {
  var district = find(districtValueSelector);
  equal(district.text().trim(), '1');
}

function assertPrefrenceGroupsDisplayed() {
  var expectedPartyNames = [
    'SD',
    'L',
    'N',
    'G',
    'C'
  ];
  var preferenceGroups = find(preferenceGroupSelector);
  equal(preferenceGroups.length, 5, 'there are 5 preference groups displayed');

  for (var i = 0; i < preferenceGroups.length; i++) {
    var preferenceGroup = find(preferenceGroups[i]);
    var partyName = preferenceGroup.find(partyNameSelector).text();
    equal(partyName, expectedPartyNames[i], 'party name `' + partyName + '` is correct');
  }
}

function assertPreferenceGroupVoterAmounts() {
  var expectedAmounts = ['50', '10', '15', '20' , '5'];
  var voterAmounts = find(voterAmountSelector);
  equal(voterAmounts.length, 5, 'there are 5 voter amounts displayed');

  for (var i = 0; i < voterAmounts.length; i++) {
    var voterAmount = find(voterAmounts[i]);
    equal(voterAmount.val(), expectedAmounts[i], 'voter amount is correct');
  }
}

function assertPreferencePartiesDisplayed() {
  var expectedParties = [
    ['C', 'G', 'N', 'L'],
    ['SD', 'C', 'G', 'N'],
    ['L', 'SD', 'C', 'G'],
    ['N', 'L', 'SD', 'C'],
    ['G', 'N', 'L', 'SD'],
  ];

  var preferenceGroups = find(preferenceGroupSelector);
  for (var i = 0; i < preferenceGroups.length; i++) {
    var preferenceGroup = find(preferenceGroups[i]);
    var parties = preferenceGroup.find(partyPreferenceSelector);
    for (var j = 1; j < parties.length; j++) { //skip over the primary party
      var party = find(parties[j]);
      equal(party.text().trim(), expectedParties[i][j-1], 'the party preference is correct');
    }
  }
}

module('Integration - District Display', {
  setup: function() {
    App = startApp();
    assertChart = App.testHelpers.assertChart;
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

test('preference groups are displayed', function() {
  expect(6);

  visit('/')
    .then(assertPrefrenceGroupsDisplayed);
});

test('preference groups voter amounts are displayed', function() {
  expect(6);

  visit('/')
    .then(assertPreferenceGroupVoterAmounts);
});

test('preference parties are displayed', function() {
  expect(20);

  visit('/')
    .then(assertPreferencePartiesDisplayed);
});

test('formula is displayed', function() {
  expect(1);
  visit('/')
    .then(assertDefaultFormulaSelected);
});

test('district is displayed', function() {
  expect(1);
  visit('/')
    .then(assertDistrictDisplayed);
});

test('assert donut graph is displayed', function(){
  expect(14);

  visit('/')
    .then(assertChartDisplay('majorityFirstRound'));
});

test('initial election results are displayed', function(){
  expect(3);

  visit('/')
    .then(assertPluralityElectionOutcome);
});

test('majority election results are displayed', function(){
  expect(5);

  navigateToMajority('/')
    .then(assertMajorityElectionOutcome);
});
