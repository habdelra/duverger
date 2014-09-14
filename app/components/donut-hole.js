import Ember from 'ember';

var get = Ember.get;
var computed = Ember.computed;
var donutMargin = 60;
var donutThickness = 118;

export default Ember.Component.extend({
  classNames: ['donut-hole'],
  attributeBindings: ['style'],

  radius: computed('diameter', function() {
    var diameter = get(this, 'diameter');
    return diameter / 2;
  }),

  innerRadius: computed('radius', function() {
    var radius = get(this, 'radius');
    return radius - donutThickness - donutMargin;
  }),

  style: computed('radius', function() {
    var innerDiameter = get(this, 'innerRadius') * 2;
    var margin = donutMargin + donutThickness;
    return 'width:' + innerDiameter +
      'px; height:' + innerDiameter +
      'px; left:' + margin + 'px; top:' + margin + 'px;';
  })

});
