import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart, navigateToMajorityRunoff, navigateToMajority;
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
var unknownMessageSelector = '.unknown-result';
var donutSelector = '.donut-chart';

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

function pressLeftArrow() {
  return pressKeyCode(37);
}

function pressUpArrow() {
  return pressKeyCode(38);
}

function pressRightArrow() {
  return pressKeyCode(39);
}

function pressDownArrow() {
  return pressKeyCode(40);
}

function pressKeyCode(keyCode) {
  var press = $.Event("keydown");
  press.ctrlKey = false;
  press.which = keyCode;
  return $(liberalVoterAmountSelector).trigger(press);
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

function assertDonutPresent() {
  var donut = find(donutSelector);
  ok(donut.length, 'donut chart is present');
}

function assertDonutNotPresent() {
  var donut = find(donutSelector);
  ok(!donut.length, 'donut chart is not present');
}

function assertUnknownMessagePresent() {
  var unknownMessage = find(unknownMessageSelector);
  ok(unknownMessage.length, 'unknown message is present');
}

function assertUnknownMessageNotPresent() {
  var unknownMessage = find(unknownMessageSelector);
  ok(!unknownMessage.length, 'unknown message is not present');
}

module('Integration - Voter Amounts', {
  setup: function() {
    App = startApp();
    assertChart = App.testHelpers.assertChart;
    navigateToMajorityRunoff = App.testHelpers.navigateToMajorityRunoff;
    navigateToMajority = App.testHelpers.navigateToMajority;
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

  navigateToMajority('/')
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

test('setting the voter amounts for all the parties to 0 displays the unknown result message', function() {
  expect(4);

  visit('/')
    .then(assertDonutPresent)
    .then(assertUnknownMessageNotPresent)
    .then(setVoterAmounts({ socialDemocrat: 0,
                            liberal: 0,
                            nationalist: 0,
                            green: 0,
                            conservative: 0 }))
    .then(assertDonutNotPresent)
    .then(assertUnknownMessagePresent);
});

test('setting the voter amounts for all the parties to ༼ ༎ຶ ෴ ༎ຶ༽ displays the unknown result message', function() {
  expect(4);

  visit('/')
    .then(assertDonutPresent)
    .then(assertUnknownMessageNotPresent)
    .then(setVoterAmounts({ socialDemocrat: '༼ ༎ຶ ෴ ༎ຶ༽',
                            liberal: 'ヽ༼ ಠ益ಠ ༽ﾉ',
                            nationalist: '༼ ͒ ̶ ͒༽',
                            green: '༼⍨༽',
                            conservative: '༼•͟ ͜ •༽' }))
    .then(assertDonutNotPresent)
    .then(assertUnknownMessagePresent);
});

test('changing the voter amount updates the chart in primary election and does not result in runoff election', function() {
  expect(16);

  navigateToMajority('/')
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
    .then(setVoterAmounts({ socialDemocrat: 45 }))
    .then(assertChartDisplay('pluralitySD45'))
    .then(assertPartyWinners(['SD']));
});

test('clicking on the voter amount decrease button decrases the voter amount by one', function() {
  expect(7);

  navigateToMajority('/')
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

test('clicking on the voter amount increase button increases the voter amount by one', function(){
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

test('up and right arrow increments voter count', function() {
  expect(2);

  visit('/')
    .then(pressUpArrow)
    .then(function() {
      equal(find(liberalVoterAmountSelector).val(), 11, 'the voter amount is correct');
    })
    .then(pressRightArrow)
    .then(function() {
      equal(find(liberalVoterAmountSelector).val(), 12, 'the voter amount is correct');
    });
});

test('down and left arrow decrements voter count', function() {
  expect(2);

  visit('/')
    .then(pressDownArrow)
    .then(function() {
      equal(find(liberalVoterAmountSelector).val(), 9, 'the voter amount is correct');
    })
    .then(pressLeftArrow)
    .then(function() {
      equal(find(liberalVoterAmountSelector).val(), 8, 'the voter amount is correct');
    });
});
