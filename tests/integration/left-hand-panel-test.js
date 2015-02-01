import startApp        from '../helpers/start-app';
import Ember           from 'ember';

var App;
var run = Ember.run;

var leftHandPanelOpenedSelector = '.left-hand-panel.opened';
var leftHandPanelClosedSelector = '.left-hand-panel.closed';
var duvergerLogoSelector = '.left-hand-panel .sprite-duverger';
var descriptionSelector = '.left-hand-panel .tab-content-about .description';
var toggleButtonSelector = '.toggle-btn';
var nextSlideButtonSelector = '.slideshow-nav .next-slide';
var previousSlideButtonSelector = '.slideshow-nav .previous-slide';
var nextSlideButtonDisabledSelector = '.slideshow-nav .next-slide.disabled';
var previousSlideButtonDisabledSelector = '.slideshow-nav .previous-slide.disabled';
var slideshowNumberSelector = '.slideshow-number';

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
  equal(find(descriptionSelector).text().trim(), 'Duverger is an instructional tool for exploring the relationship between what voters want, different types of electoral systems, and the outcomes of legislative elections.', 'Duverger description is present');
}

function clickToggleButton() {
  return click(toggleButtonSelector);
}

function clickNextSlide() {
  return click(nextSlideButtonSelector);
}

function clickPreviousSlide() {
  return click(previousSlideButtonSelector);
}

function assertSlideDisplayed(idx) {
  return function() {
    ok(find('.slide'+idx+'-visible').length, 'slide ' + idx + ' is displayed');
  };
}

function assertNextSlideButtonDisabled() {
  ok(find(nextSlideButtonDisabledSelector).length, 'next slide button is disabled');
}

function assertPreviousSlideButtonDisabled() {
  ok(find(nextSlideButtonDisabledSelector), 'next slide button is disabled');
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

test('slideshow navigation works correctly', function() {
  expect(11);

  visit('/')
    .then(assertSlideDisplayed(0))
    .then(clickNextSlide)
    .then(assertSlideDisplayed(1))
    .then(clickNextSlide)
    .then(assertSlideDisplayed(2))
    .then(clickNextSlide)
    .then(assertSlideDisplayed(3))
    .then(clickNextSlide)
    .then(assertSlideDisplayed(4))
    .then(assertNextSlideButtonDisabled)
    .then(clickPreviousSlide)
    .then(assertSlideDisplayed(3))
    .then(clickPreviousSlide)
    .then(assertSlideDisplayed(2))
    .then(clickPreviousSlide)
    .then(assertSlideDisplayed(1))
    .then(clickPreviousSlide)
    .then(assertSlideDisplayed(0))
    .then(assertPreviousSlideButtonDisabled);
});
