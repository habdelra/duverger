import Ember from 'ember';
import ElectionOutcomeMixin from '../mixins/election-outcome';
import formulaLookup from '../utils/formula-lookup';

var get = Ember.get;
var set = Ember.set;
var computed = Ember.computed;
var alias = computed.alias;
var observer = Ember.observer;

export default Ember.ObjectController.extend(ElectionOutcomeMixin, {
  data: alias('content.preferenceGroups'),

  _calculateElectionOutcome: function(){
    var formula = get(this, 'formula');
    var preferenceGroups = get(this, 'preferenceGroups');
    return formula(preferenceGroups);
  },

  formula: computed('formulaName', function(){
    var formulaName = get(this, 'formulaName');
    var container = get(this, 'container');
    return formulaLookup(formulaName, container);
  }),

  whenElectionOutcomeNeedsToChange: observer('formula', 'preferenceGroups.@each.voters', function(){
    var electionOutcome = this._calculateElectionOutcome();
    set(this, 'electionOutcome', electionOutcome);
  }),

  actions: {
    useFormula: function(formulaName){
      if (formulaName === 'plurality') {
        set(this, 'currentRunoff', 0);
      }
      set(this, 'formulaName', formulaName);
    },

    recalculateElectionOutcome: function() {
      var electionOutcome = this._calculateElectionOutcome();
      set(this, 'electionOutcome', electionOutcome);
    }
  }

});
