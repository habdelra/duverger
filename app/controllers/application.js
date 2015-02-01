import Ember from 'ember';
import ElectionOutcomeMixin from '../mixins/election-outcome';
import formulaLookup from '../utils/formula-lookup';

var get = Ember.get;
var set = Ember.set;
var computed = Ember.computed;
var alias = computed.alias;
var mapBy = computed.mapBy;
var sum = computed.sum;
var observer = Ember.observer;

export default Ember.ObjectController.extend(ElectionOutcomeMixin, {
  data: alias('content.preferenceGroups'),
  voterAmounts : mapBy('preferenceGroups', 'voters'),
  totalVoters: sum('voterAmounts'),

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
    toggleFormulaList: function() {
      var showFormulaList = get(this, 'showFormulaList');
      set(this, 'showFormulaList', !showFormulaList);
    },
    useFormula: function(option){
      var formulaName = option.value;

      if (formulaName === 'plurality') {
        set(this, 'currentRunoff', 0);
      }
      set(this, 'formulaName', formulaName);
      set(this, 'showFormulaList', false);
    },

    recalculateElectionOutcome: function() {
      var electionOutcome = this._calculateElectionOutcome();
      set(this, 'electionOutcome', electionOutcome);
    },

    viewRunoffElection: function(){
      set(this, 'currentRunoff', 1);
    },

    viewOriginalElection: function(){
      set(this, 'currentRunoff', 0);
    },

    preferenceStartedMoving: function() {
      set(this, 'showPreferenceOrderControl', true);
    },

    modalDismissed: function() {
      set(this, 'preferenceIsMoving', null);
      set(this, 'showPreferenceOrderControl', false);
      set(this, 'visibleCoinTossIndex', null);
    },

    movePreferenceBefore: function() {
      set(this, 'preferenceMoveDirection', 'previous');
    },

    movePreferenceAfter: function() {
      set(this, 'preferenceMoveDirection', 'after');
    },

    partyAtBeginning: function() {
      set(this, 'preferencePreviousButtonDisabled', true);
      set(this, 'preferenceNextButtonDisabled', false);
    },

    partyAtMiddle: function() {
      set(this, 'preferencePreviousButtonDisabled', false);
      set(this, 'preferenceNextButtonDisabled', false);
    },

    partyAtEnd: function() {
      set(this, 'preferenceNextButtonDisabled', true);
      set(this, 'preferencePreviousButtonDisabled', false);
    },

    showCoinToss: function(index) {
      set(this, 'visibleCoinTossIndex', index);
    }
  }
});
