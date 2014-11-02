import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart, navigateToMajorityRunoff, navigateToPlurality;
var run = Ember.run;
var keys = Ember.keys;

var originalRandomFunction;

var preferenceGroupSelector = '.preference-group';
var inputSelector = '.vote-input';
var electionOutcomeSelector = '.party-winner';
var dropZoneSelector = '.preference-group.liberal .preference-drop-zone';
var tieSelector = '.election-outcome';
var runoffSelector = '.election-nav-btn.view-runoff';
var increaseLiberalVoterSelector = '.preference-group.liberal .voter-amount-btn.increase';
var decreaseLiberalVoterSelector = '.preference-group.liberal .voter-amount-btn.decrease';
var liberalVoterAmountSelector = '.preference-group.liberal .vote-input';
var percentageSelector = '.preference-group-percentage';
var totalVotersValueSelector = '.total-voters__value';

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
  };
}

function clickIncreaseVoterAmount() {
  return click(increaseLiberalVoterSelector);
}

function clickDecreaseVoterAmount() {
  return click(decreaseLiberalVoterSelector);
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

function assertPercentages(voterPercentages) {
  return function() {
    var parties = keys(voterPercentages);
    parties.forEach(function(party) {
      var partyPercentageSelector = preferenceGroupSelector + '.' + party + ' ' + percentageSelector;
      var partyPercentage = find(partyPercentageSelector);
      ok(partyPercentage.text().trim().indexOf(voterPercentages[party]) > -1, 'the percentage is correct');
    });
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

function assertTotalVotesCount(voteCount) {
  var totalVoters = find(totalVotersValueSelector);

  return function() {
    equal(totalVoters.text().trim(), voteCount, 'total vote count is ' + voteCount);
  };
}

module('Integration - Voter Amounts', {
  setup: function() {
    App = startApp();
    assertChart = App.testHelpers.assertChart;
    navigateToMajorityRunoff = App.testHelpers.navigateToMajorityRunoff;
    navigateToPlurality = App.testHelpers.navigateToPlurality;
    originalRandomFunction = Math.random;
    //need to fake randomness so that we can make deterministic assertions in the tests
    Math.random = function() {
      return 0;
    };
  },
  teardown: function() {
    run(App, 'destroy');
    Math.random = originalRandomFunction;
  }
});

test('changing the voter amount updates the chart in primary election and results in runoff election', function() {
  expect(22);

  visit('/')
    .then(assertPercentages({
      socialDemocrat: '50%',
      liberal: '10%',
      nationalist: '15%',
      green: '20%',
      conservative: '5%'
    }))
    .then(setVoterAmounts({ socialDemocrat: 45 }))
    .then(assertChartDisplay('majorityFirstRoundSD45'))
    .then(assertPartyWinners(['SD', 'G']));
});

test('changing the voter amount updates the chart in primary election and does not result in runoff election', function() {
  expect(16);

  visit('/')
    .then(setVoterAmounts({ socialDemocrat: 80 }))
    .then(assertChartDisplay('majorityFirstRoundSD80'))
    .then(assertPartyWinners(['SD']));
});

test('changing the voter amount updates the chart in runoff election', function() {
  expect(16);

  navigateToMajorityRunoff('/')
    .then(setVoterAmounts({ socialDemocrat: 45 }))
    .then(assertChartDisplay('majorityRunoffSD45'))
    .then(assertPartyWinners(['SD']));
});

test('changing the voter amount updates the chart in runoff election to a result that does not require a runoff election', function() {
  expect(16);

  navigateToMajorityRunoff('/')
    .then(setVoterAmounts({ socialDemocrat: 80 }))
    .then(assertChartDisplay('majorityFirstRoundSD80'))
    .then(assertPartyWinners(['SD']));
});


test('changing the voter amount updates the chart that was previously altered by changing party preferences', function() {
  expect(16);

  navigateToMajorityRunoff('/')
    .then(dragFourthPreferencePartyInLiberalGroupToSecondPosition)
    .then(setVoterAmounts({ socialDemocrat: 45 }))
    .then(assertChartDisplay('majorityRunoffPreferenceChangeSD45'))
    .then(assertPartyWinners(['SD']));
});

test('changing the voter amount updates the chart using the plurality formula', function() {
  expect(16);

  visit('/')
    .then(navigateToPlurality)
    .then(setVoterAmounts({ socialDemocrat: 45 }))
    .then(assertChartDisplay('pluralitySD45'))
    .then(assertPartyWinners(['SD']));
});

test('clicking on the voter amount decrease button decrases the voter amount by one', function() {
  expect(7);
  visit('/')
    .then(clickDecreaseVoterAmount)
    .then(function() {
      equal(find(liberalVoterAmountSelector).val(), 9, 'the voter amount is correct');
    })
    .then(clickDecreaseVoterAmount)
    .then(clickDecreaseVoterAmount)
    .then(clickDecreaseVoterAmount)
    .then(clickDecreaseVoterAmount)
    .then(function() {
      equal(find(liberalVoterAmountSelector).val(), 5, 'the voter amount is correct');
    })
    .then(assertPercentages({
      socialDemocrat: '52.6%',
      liberal: '5.3%',
      nationalist: '15.8%',
      green: '21.1%',
      conservative: '5.3%'
    }));
});

test('clicking on the voter amount incrase button increases the voter amount by one', function(){
  expect(1);
  visit('/')
    .then(clickIncreaseVoterAmount)
    .then(function() {
      equal(find(liberalVoterAmountSelector).val(), 11, 'the voter amount is correct');
    });
});

test('when the voter amount is zero, decrease button is disabled', function() {
  expect(2);
  visit('/')
    .then(setVoterAmounts({
      liberal: 0
    }))
    .then(clickDecreaseVoterAmount)
    .then(function() {
      equal(find(liberalVoterAmountSelector).val(), 0, 'the voter amount is correct');
      ok(find(decreaseLiberalVoterSelector).prop('disabled'), 'the decrease button is disabled');
    });
});

test('display total votes cast', function() {
  expect(3);

  visit('/')
    .then(assertTotalVotesCount(100))
    .then(setVoterAmounts({
      socialDemocrat: 30,
      liberal: 0,
      nationalist: 0,
      green: 0,
      conservative: 30
    }))
    .then(assertTotalVotesCount(60))
    .then(setVoterAmounts({
      nationalist: 10
    }))
    .then(assertTotalVotesCount(70));
});
