import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App;
var run = Ember.run;

var leftHandPanelOpenedSelector = '.left-hand-panel.opened';
var leftHandPanelClosedSelector = '.left-hand-panel.closed';
var duvergerLogoSelector = '.left-hand-panel .duverger-logo';
var descriptionSelector = '.left-hand-panel .description';
var toggleButtonSelector = '.toggle-btn';

function assertLHPOpen() {
  equal(find(leftHandPanelOpenedSelector).length, 1, 'left hand panel is open');
  equal(find(leftHandPanelClosedSelector).length, 0, 'left hand panel is not closed');
}

function assertLHPClosed() {
  equal(find(leftHandPanelClosedSelector).length, 1, 'left hand panel is closed');
  equal(find(leftHandPanelOpenedSelector).length, 0, 'left hand panel is not open');
}

function assertDuvergerLogoPresent() {
  equal(find(duvergerLogoSelector).length, 1, 'Duverger logo is present');
}

function assertDuvergerDescriptionPresent() {
  equal(find(descriptionSelector).text().trim(), 'Duverger is an instructional tool for exploring the relationship between what voters want, different types of electoral system, and the outcomes of legislative elections.', 'Duverger description is present');
}

function clickToggleButton() {
  return click(toggleButtonSelector);
}

module('Integration - Left Hand Panel', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    run(App, 'destroy');
  }
});

test('left hand panel is open on initial page load', function() {
  expect(4);

  visit('/')
    .then(assertLHPOpen)
    .then(assertDuvergerLogoPresent)
    .then(assertDuvergerDescriptionPresent);
});

test('click on toggle causes the left hand panel to toggle', function() {
  expect(4);

  visit('/')
    .then(clickToggleButton)
    .then(assertLHPClosed)
    .then(clickToggleButton)
    .then(assertLHPOpen);
});
