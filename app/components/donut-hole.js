import Ember from 'ember';
import chartConstants from '../utils/chart-constants';
import ElectionOutcomeMixin from '../mixins/election-outcome';

var get = Ember.get;
var computed = Ember.computed;

var donutMargin = chartConstants().donutMargin;
var donutThickness = chartConstants().donutThickness;

export default Ember.Component.extend(ElectionOutcomeMixin, {
  showCoinToss: 'showCoinToss',

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
    showCoinToss: function(context) {
      var triggerIndex = context.$().parent().index() - 1;
      this.sendAction('showCoinToss', triggerIndex);
    }
  }
});
