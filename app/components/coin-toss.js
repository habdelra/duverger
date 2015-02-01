import Ember from 'ember';
import ElectionOutcomeMixin from '../mixins/election-outcome';
import partyLookup from '../utils/party-lookup';

var get = Ember.get;
var computed = Ember.computed;

export default Ember.Component.extend(ElectionOutcomeMixin, {
  isVirtual: true,
  tagName: '',

  showCoinToss: computed('visibleCoinTossIndex', 'index', 'coinTossHappened', function() {
    var index = get(this, 'index');
    var visibleCoinTossIndex = get(this, 'visibleCoinTossIndex');
    var coinTossHappened = get(this, 'coinTossHappened');

    return index === visibleCoinTossIndex && coinTossHappened;
  }),

  parties: computed('coinTossParticipants', 'coinTossWinners', function() {
    var participants = get(this, 'coinTossParticipants');
    var winners = get(this, 'coinTossWinners');

    var sortedWinners = winners.map(function(winner) {
      return {
        name: winner,
        abbreviation: partyLookup(winner, 'abbreviation'),
        isWinner: true
      };
    }).sortBy('name');

    var sortedParticipants = participants.map(function(participant){
      return {
        name: participant,
        abbreviation: partyLookup(participant, 'abbreviation'),
        isWinner: false
      };
    }).filter(function(participant) {
      return !winners.contains(participant.name);
    }).sortBy('name');

    return sortedWinners.addObjects(sortedParticipants);
  })
});
