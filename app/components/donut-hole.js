import Ember from 'ember';

var get = Ember.get;
var computed = Ember.computed;

export default Ember.Component.extend({
  classNames: ['donut-hole'],
  attributeBindings: ['style'],

  radius: computed('diameter', function() {
    var diameter = get(this, 'diameter');
    return diameter / 2;
  }),

  style: computed('radius', function() {
    var radius = get(this, 'radius');
    var margin = radius/2 + 40;
    return 'width:' + radius +
      'px; height:' + radius +
      'px; left:' + margin + 'px; top:' + margin + 'px;';
  })

});
