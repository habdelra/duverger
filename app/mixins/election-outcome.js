import Ember from 'ember';
import partyLookup from '../utils/party-lookup';

var get = Ember.get;
var set = Ember.set;
var computed = Ember.computed;
var alias = computed.alias;
var equal = computed.equal;
var keys = Ember.keys;

export default Ember.Mixin.create({
  currentRunoff: 0,
  votedFor: alias('electionOutcomeForCurrentRunoff.votedFor'),
  winners: alias('electionOutcomeForCurrentRunoff.winners'),
  runoffs: alias('electionOutcome.length'),
  hasWinner: equal('winners.length', 1),

  //D3 is really sensitive to the voterSummary order. Sort this by party for consistency
  voterSummary: computed('electionOutcomeForCurrentRunoff.voterSummary', function() {
    var voterSummary = get(this, 'electionOutcomeForCurrentRunoff.voterSummary');
    return voterSummary.sort(function(a, b){
      var partyA = keys(a)[0];
      var partyB = keys(b)[0];

      if (partyA > partyB) {
        return 1;
      }
      if (partyA < partyB) {
        return -1;
      }
      return 0;
    });
  }),

  displayParties: computed('winners', function(){
    var winners = get(this, 'winners');
    return winners.map(function(party){
      return {
        name: partyLookup(party, 'name'),
        abbreviation: partyLookup(party, 'abbreviation'),
        color: partyLookup(party, 'color')
      };
    });
  }),

  electionOutcomeForCurrentRunoff: computed('electionOutcome', 'currentRunoff', function() {
    var electionOutcome = get(this, 'electionOutcome');
    var currentRunoff = get(this, 'currentRunoff');
    if (currentRunoff > get(electionOutcome, 'length') - 1) {
      currentRunoff = 0;
      set(this, 'currentRunoff', currentRunoff);
    }
    return electionOutcome.objectAt(currentRunoff);
  }),

  requiresRunoff: computed('runoffs', 'currentRunoff', function() {
    var currentRunoff = get(this, 'currentRunoff');
    var runoffs = get(this, 'runoffs');
    return !!runoffs && currentRunoff < runoffs - 1;
  }),

  winningParty: computed('winners', function(){
    var winners = get(this, 'winners');
    if (get(winners, 'length') === 1) {
      return get(winners, 'firstObject');
    }
  }),

  _winningField: function(field){
    var party = get(this, 'winningParty');
    if (!party) { return; }

    return partyLookup(party, field);
  },

  winnerName: computed('winningParty', function() {
    return this._winningField('name');
  }),

  winnerAbbreviation: computed('winningParty', function() {
    return this._winningField('abbreviation');
  }),

  winnerColor: computed('winningParty', function() {
    return this._winningField('color');
  }),

});

