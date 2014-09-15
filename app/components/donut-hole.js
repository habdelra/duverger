import Ember from 'ember';
import chartConstants from '../utils/chart-constants';
import ElectionOutcomeMixin from '../mixins/election-outcome';

var get = Ember.get;
var set = Ember.set;
var computed = Ember.computed;

var donutMargin = chartConstants().donutMargin;
var donutThickness = chartConstants().donutThickness;


export default Ember.Component.extend(ElectionOutcomeMixin, {
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
  }),

  actions: {
    viewRunoffElection: function(){
      set(this, 'currentRunoff', 1);
    },
    viewOriginalElection: function(){
      set(this, 'currentRunoff', 0);
    }
  }
});
