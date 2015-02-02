import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

moduleForComponent('donut-hole');

test('radius is half of the diameter', function() {
  expect(1);

  var component = this.subject({
    diameter: 6
  });

  equal(get(component, 'radius'), 3, 'the radius is correct');
});

test('innerRadius is the radius - donutThickness - donut margin', function(){
  expect(1);

  var component = this.subject({
    radius: 300
  });

  equal(get(component, 'innerRadius'), 148, 'the innerRadius is correct');
});

test('style returns the CSS position of the donut hole', function() {
  expect(1);

  var component = this.subject({
    radius: 300
  });

  var expected = 'width:296px; height:296px; left:152px; top:152px;';
  equal(get(component, 'style'), expected, 'the style is correct');
});

test('showCoinToss action is forwarded with the index of the context', function() {
  expect(2);

  var context = {
    $: function() {
      return {
        parent: function() {
          return {
            index: function() {
              return 1;
            }
          };
        }
      };
    }
  };

  var component = this.subject({
    sendAction: function(actionName, index) {
      equal(actionName, 'showCoinToss', 'the showCoinToss action is fired');
      equal(index, 0, 'the index is send correctly');
    }
  });

  component.send('showCoinToss', context);
});
