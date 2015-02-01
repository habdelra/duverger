import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;
var run = Ember.run;

moduleForComponent('left-hand-panel');

test('visibleSlide gives the visible slide class', function() {
  expect(3);

  var component = this.subject({
    slideNumber: 1
  });

  equal(get(component, 'visibleSlide'), 'slide1-visible', 'slide visible class is slide1-visible');

  run(function() {
    set(component, 'slideNumber', 2);
  });

  equal(get(component, 'visibleSlide'), 'slide2-visible', 'slide visible class is slide2-visible');

  run(function() {
    set(component, 'slideNumber', 100);
  });

  equal(get(component, 'visibleSlide'), 'slide100-visible', 'slide visible class is slide100-visible');
});

test('toggleLeftHandPanel action toggles isOpened', function() {
  expect(3);

  var component = this.subject();

  equal(get(component, 'isOpened'), true, 'isOpened is true');

  component.send('toggleLeftHandPanel');

  equal(get(component, 'isOpened'), false, 'isOpened is false');

  component.send('toggleLeftHandPanel');

  equal(get(component, 'isOpened'), true, 'isOpened is true');
});

test('incrementSlideNumber increments slide number', function() {
  expect(4);

  var component = this.subject();

  equal(get(component, 'slideNumber'), 0, 'slide number is 0');

  component.send('incrementSlideNumber');

  equal(get(component, 'slideNumber'), 1, 'slide number is 1');

  component.send('incrementSlideNumber');

  equal(get(component, 'slideNumber'), 2, 'slide number is 2');

  component.send('incrementSlideNumber');

  equal(get(component, 'slideNumber'), 3, 'slide number is 3');
});

test('incrementSlideNumber doesnt increment if last slide', function() {
  expect(1);

  var component = this.subject({
    slideNumber: 4
  });

  component.send('incrementSlideNumber');

  equal(get(component, 'slideNumber'), 4, 'slide number is still 4');
});

test('decrementSlideNumber decrements slide number', function() {
  expect(3);

  var component = this.subject({
    slideNumber: 3
  });

  equal(get(component, 'slideNumber'), 3, 'slide number is 3');

  component.send('decrementSlideNumber');

  equal(get(component, 'slideNumber'), 2, 'slide number is 2');

  component.send('decrementSlideNumber');

  equal(get(component, 'slideNumber'), 1, 'slide number is 1');
});

test('decrementSlideNumber doesnt decrement if first slide', function() {
  expect(1);

  var component = this.subject({
    slideNumber: 0
  });

  component.send('decrementSlideNumber');

  equal(get(component, 'slideNumber'), 0, 'slide number is still 0');
});

