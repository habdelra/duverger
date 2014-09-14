import Ember from 'ember';
import chartConstants from '../utils/chart-constants';
import formulaLookup from '../utils/formula-lookup';
import partyLookup from '../utils/party-lookup';

var get = Ember.get;
var computed = Ember.computed;
var donutMargin = chartConstants().donutMargin;
var donutThickness = chartConstants().donutThickness;


export default Ember.Component.extend({
  classNames: ['donut-hole'],
  attributeBindings: ['style'],

  electionOutcome: computed('formula', 'data.@each.voters', function() {
    var data = get(this, 'data');
    var container = get(this, 'container');
    var formulaName = get(this, 'formula');
    var formula = formulaLookup(formulaName, container);
    return formula(data);
  }),

  _outcomeField: function(field){
    var electionOutcome = get(this, 'electionOutcome');
    var value = partyLookup(electionOutcome, field);
    if (!value) { return electionOutcome; }

    return value;
  },

  requiresRunoff: computed('electionOutcome', function() {
    var electionOutcome = get(this, 'electionOutcome');
    return !partyLookup(electionOutcome, 'name');
  }),

  outcomeName: computed('electionOutcome', function() {
    return this._outcomeField('name');
  }),

  outcomeAbbreviation: computed('electionOutcome', function() {
    return this._outcomeField('abbreviation');
  }),

  outcomeMessage: computed('outcomeName','outcomeAbbreviation', 'requiresRunoff', function(){
    var outcomeName = get(this, 'outcomeName');
    var outcomeAbbreviation = get(this, 'outcomeAbbreviation');
    var requiresRunoff = get(this, 'requiresRunoff');
    return requiresRunoff ? outcomeName : outcomeName + ' (' + outcomeAbbreviation + ')';
  }),

  outcomeColor: computed('electionOutcome', function() {
    return this._outcomeField('color');
  }),

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
