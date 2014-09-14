import Ember from 'ember';

var get = Ember.get;
var emberA = Ember.A;

export default function(preferenceGroups){
  var preferenceGroupsArray = emberA(preferenceGroups);

  var sortedPreferredPartyTotals = preferenceGroupsArray.map(function(preferenceGroup) {
    var primaryPartyPreference = preferenceGroup.preferences[0].party;
    return {
      party: primaryPartyPreference,
      voters: preferenceGroup.voters
    };
  }).sortBy('voters');

  var potentialWinner = get(sortedPreferredPartyTotals, 'lastObject');
  var numberOfParties = get(sortedPreferredPartyTotals, 'length');

  if(numberOfParties > 1 && potentialWinner.voters === sortedPreferredPartyTotals.objectAt(numberOfParties - 2).voters) {
    return 'Tied';
  }

  return potentialWinner.party;
}
