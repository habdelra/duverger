import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App, assertChart, navigateToMajorityRunoff, navigateToMajority;
var run = Ember.run;

var originalRandomFunction;

var liberalGroupPartyPreference = '.preference-group.liberal .party-preference';
var dropZoneSelector = '.preference-group.liberal .preference-drop-zone';
var electionOutcomeSelector = '.party-winner';
var liberalSDPreferenceButtonSelector = '.preference-group.liberal .party-preference.socialDemocrat button';
var liberalNationalistPreferenceButtonSelector = '.preference-group.liberal .party-preference.nationalist button';
var liberalGreenPreferenceButtonSelector = '.preference-group.liberal .party-preference.green button';
var liberalGreenPreferenceSelector = '.preference-group.liberal .party-preference.green';
var preferenceOrderMask = '#modal';
var preferenceOrderModal = '#modal ic-modal-main';
var preferenceMoveBeforeButton = '.move-before';
var preferenceMoveAfterButton = '.move-after';
var partyPreferenceHighlightClass = 'moving';

function clickPreferenceOrderMask() {
  return click(preferenceOrderMask);
}

function clickMoveBeforeButton() {
  return click(preferenceMoveBeforeButton);
}

function clickMoveAfterButton() {
  return click(preferenceMoveAfterButton);
}

function clickLiberalsSDPartyPreferenceButton() {
  click(liberalSDPreferenceButtonSelector);
}

function clickLiberalsNationalistPartyPreferenceButton() {
  click(liberalNationalistPreferenceButtonSelector);
}

function clickLiberalsGreenPartyPreferenceButton() {
  return click(liberalGreenPreferenceButtonSelector);
}

function assertMoveBeforeButtonIsDisabled() {
  var button = find(preferenceMoveBeforeButton);
  ok(button.prop('disabled'), 'move before button is disabled');
}

function assertMoveBeforeButtonIsNotDisabled() {
  var button = find(preferenceMoveBeforeButton);
  ok(!button.prop('disabled'), 'move before button is not disabled');
}

function assertMoveAfterButtonIsDisabled() {
  var button = find(preferenceMoveAfterButton);
  ok(button.prop('disabled'), 'move after button is disabled');
}

function assertMoveAfterButtonIsNotDisabled() {
  var button = find(preferenceMoveAfterButton);
  ok(!button.prop('disabled'), 'move after button is not disabled');
}

function assertLiberalsGreenPartyPreferenceIsHighlighted() {
  var partyPreference = find(liberalGreenPreferenceSelector);
  ok(partyPreference.hasClass(partyPreferenceHighlightClass), 'the highlight class is present');
}

function assertLiberalsGreenPartyPreferenceIsNotHighlighted() {
  var partyPreference = find(liberalGreenPreferenceSelector);
  ok(!partyPreference.hasClass(partyPreferenceHighlightClass), 'the highlight class is not present');
}

function assertPreferenceOrderModalAppears() {
  var preferenceOrder = find(preferenceOrderModal);
  ok(preferenceOrder.length, 'the preference order modal appears');
}

function assertPreferenceOrderModalDoesNotAppear() {
  var preferenceOrder = find(preferenceOrderModal);
  ok(!preferenceOrder.length, 'the preference order modal does not appear');
}

function assertChartDisplay(chartType) {
  return function() {
    assertChart(chartType);
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
    navigateToMajority = App.testHelpers.navigateToMajority;
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

test('drag-n-drop rearrange preferences that do not effect the donut graph', function() {
  expect(44);

  navigateToMajority('/')
    .then(assertChartDisplay('majorityFirstRound'))
    .then(assertLiberalGroupsNewPreferences(['SD', 'C', 'G', 'N']))
    .then(assertPartyWinners(['SD', 'G']))
    .then(dragFourthPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['SD', 'G']))
    .then(assertLiberalGroupsNewPreferences(['G', 'SD', 'C', 'N']))
    .then(assertChartDisplay('majorityFirstRound'));
});

test('drag-n-drop rearrange preferences that effect donut graph', function(){
  expect(46);

  navigateToMajorityRunoff('/')
    .then(assertChartDisplay('majorityRunoff'))
    .then(dragFourthPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['SD']))
    .then(assertChartDisplay('majorityRunoffPreferenceChange'))
    .then(dragFourthPreferencePartyInLiberalGroupToSecondPosition)
    .then(assertPartyWinners(['SD']))
    .then(assertChartDisplay('majorityRunoff'));
});

test('use arrow buttons to rearrange preferences', function() {
  expect(53);

  navigateToMajority('/')
    .then(assertLiberalGroupsNewPreferences(['SD', 'C', 'G', 'N']))
    .then(assertPreferenceOrderModalDoesNotAppear)
    .then(assertLiberalsGreenPartyPreferenceIsNotHighlighted)
    .then(clickLiberalsGreenPartyPreferenceButton)
    .then(assertPreferenceOrderModalAppears)
    .then(assertLiberalsGreenPartyPreferenceIsHighlighted)
    .then(assertMoveBeforeButtonIsNotDisabled)
    .then(assertMoveAfterButtonIsNotDisabled)
    .then(clickMoveBeforeButton)
    .then(assertLiberalsGreenPartyPreferenceIsHighlighted)
    .then(assertLiberalGroupsNewPreferences(['SD', 'G', 'C', 'N']))
    .then(assertMoveBeforeButtonIsNotDisabled)
    .then(assertMoveAfterButtonIsNotDisabled)
    .then(clickMoveBeforeButton)
    .then(assertLiberalsGreenPartyPreferenceIsHighlighted)
    .then(assertLiberalGroupsNewPreferences(['G', 'SD', 'C', 'N']))
    .then(assertMoveBeforeButtonIsDisabled)
    .then(assertMoveAfterButtonIsNotDisabled)
    .then(clickMoveAfterButton)
    .then(assertLiberalsGreenPartyPreferenceIsHighlighted)
    .then(assertLiberalGroupsNewPreferences(['SD', 'G', 'C', 'N']))
    .then(assertMoveBeforeButtonIsNotDisabled)
    .then(assertMoveAfterButtonIsNotDisabled)
    .then(clickMoveAfterButton)
    .then(assertLiberalsGreenPartyPreferenceIsHighlighted)
    .then(assertLiberalGroupsNewPreferences(['SD', 'C', 'G', 'N']))
    .then(assertMoveBeforeButtonIsNotDisabled)
    .then(assertMoveAfterButtonIsNotDisabled)
    .then(clickMoveAfterButton)
    .then(assertLiberalsGreenPartyPreferenceIsHighlighted)
    .then(assertLiberalGroupsNewPreferences(['SD', 'C', 'N', 'G']))
    .then(assertMoveBeforeButtonIsNotDisabled)
    .then(assertMoveAfterButtonIsDisabled)
    .then(clickPreferenceOrderMask)
    .then(assertPreferenceOrderModalDoesNotAppear)
    .then(assertLiberalsGreenPartyPreferenceIsNotHighlighted);
});

test('when party preference is at beginning of list the previous arrow button is disabled', function() {
  expect(2);

  navigateToMajority('/')
    .then(clickLiberalsSDPartyPreferenceButton)
    .then(assertMoveBeforeButtonIsDisabled)
    .then(assertMoveAfterButtonIsNotDisabled);
});

test('when party preference is at end of list the next arrow button is disabled', function() {
  expect(2);

  navigateToMajority('/')
    .then(clickLiberalsNationalistPartyPreferenceButton)
    .then(assertMoveBeforeButtonIsNotDisabled)
    .then(assertMoveAfterButtonIsDisabled);
});
