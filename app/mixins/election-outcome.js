import Ember from 'ember';
import partyLookup from '../utils/party-lookup';

var get = Ember.get;
var computed = Ember.computed;
var alias = computed.alias;
var equal = computed.equal;
var not = computed.not;

export default Ember.Mixin.create({
  parties: alias('electionOutcomeForCurrentRunoff.parties'),
  voterSummary: alias('electionOutcomeForCurrentRunoff.voterSummary'),
  runoffs: alias('electionOutcome.length'),
  currentRunoff: 0,

  hasTie: not('parties.length'),
  hasWinner: equal('parties.length', 1),

  displayParties: computed('parties', function(){
    var parties = get(this, 'parties');
    return parties.map(function(party){
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
    return electionOutcome.objectAt(currentRunoff);
  }),

  requiresRunoff: computed('runoffs', 'currentRunoff', function() {
    var currentRunoff = get(this, 'currentRunoff');
    var runoffs = get(this, 'runoffs');
    return !!runoffs && currentRunoff < runoffs - 1;
  }),

  winningParty: computed('parties', function(){
    var parties = get(this, 'parties');
    if (get(parties, 'length') === 1) {
      return get(parties, 'firstObject');
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

  winningColor: computed('winningParty', function() {
    return this._winningField('color');
  }),

});

