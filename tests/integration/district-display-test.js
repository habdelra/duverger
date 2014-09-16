import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App;
var run = Ember.run;

var preferenceGroupSelector = '.preference-group';
var partyNameSelector = '.party-name';
var voterAmountSelector = '.vote-input';
var partyPreferenceSelector = '.party-preference';
var formulaSelector = '.formula';
var districtSelector = '.district';
var donutSvgSelector = '.donut-chart svg';
var electionOutcomeSelector = '.party-winner.runoff';

function assertElectionOutcome() {
  var expectedWinners = ['Social Democrat (SD)', 'Conservative (C)'];
  var outcome = find(electionOutcomeSelector);
  equal(outcome.length, 2, 'there are 2 election winners');

  for (var i = 0; i < outcome.length; i++) {
    var winner = find(outcome[i]);
    equal(winner.text().trim(), expectedWinners[i], 'the correct winner is displayed');
  }
}

function assertDonutGraphDisplayed() {
  var expectedPartyColors = [
    '#777777',
    '#BBDF2A',
    '#F8DB3B',
    '#46C8B3',
    '#FB5258'
  ];
  var expectedLines = [
    'rotate(36)',
    'rotate(108)',
    'rotate(162)',
    'rotate(216)',
    'rotate(306)'
  ];
  var expectedText = [ '20%', '20%', '10%', '20%', '30%' ];

  var svg = find(donutSvgSelector);
  ok(svg.length, 'Chart SVG is displayed');

  var donutSegments = svg.find('path');
  equal(donutSegments.length, 5, 'there are 5 parties displayed in the chart');

  for(var i = 0; i < donutSegments.length; i++) {
    var donutSegment = find(donutSegments[i]);
    equal(donutSegment.attr('fill'), expectedPartyColors[i], 'donut segment color is correct');
  }

  var lines = svg.find('line');
  equal(lines.length, 5, 'there are 5 lines displayed in the chart');

  for(i = 0; i < lines.length; i++) {
    var line = find(lines[i]);
    equal(line.attr('transform'), expectedLines[i], 'the line transform is correct');
  }

  var texts = svg.find('text');
  equal(texts.length, 5, 'there are 5 text annotations displayed in the chart');

  for (i = 0; i < texts.length; i++) {
    var text = find(texts[i]);
    equal(text.text(), expectedText[i], 'the correct text annotation is displayed');
  }
}

function assertFormulaDisplayed() {
  var formula = find(formulaSelector);
  equal(formula.text().trim(), 'Formula: majority');
}

function assertDistrictDisplayed() {
  var district = find(districtSelector);
  equal(district.text().trim(), 'District 1');
}

function assertPrefrenceGroupsDisplayed() {
  var expectedPartyNames = [
    'Social Democrat (SD)',
    'Liberal (L)',
    'Nationalist (N)',
    'Green (G)',
    'Conservative (C)'
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
  var expectedAmounts = ['30', '10', '20', '20' , '20'];
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
  },
  teardown: function() {
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
    .then(assertFormulaDisplayed);
});

test('district is displayed', function() {
  expect(1);
  visit('/')
    .then(assertDistrictDisplayed);
});

test('assert donut graph is displayed', function(){
  expect(19);

  visit('/')
    .then(assertDonutGraphDisplayed);
});

test('initial election results are displayed', function(){
  expect(3);

  visit('/')
    .then(assertElectionOutcome);
});
