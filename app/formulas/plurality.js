import Ember from 'ember';

var get = Ember.get;
var emberA = Ember.A;

export default function(preferenceGroups){
  var result = {};
  var preferenceGroupsArray = emberA(preferenceGroups);
  var sortedPartyTotals = preferenceGroupsArray.map(function(preferenceGroup) {
    var primaryPartyPreference = preferenceGroup.preferences[0].party;
    return {
      party: primaryPartyPreference,
      voters: preferenceGroup.voters
    };
  }).sortBy('voters');
  result.voterSummary = sortedPartyTotals.map(function(partyTotal) {
    var summary = {};
    summary[partyTotal.party] = partyTotal.voters;
    return summary;
  });

  var potentialWinner = get(sortedPartyTotals, 'lastObject');
  var numberOfParties = get(sortedPartyTotals, 'length');

  if(numberOfParties > 1 && potentialWinner.voters === sortedPartyTotals.objectAt(numberOfParties - 2).voters) {
    result.parties = [];//for now an empty array means tied
    return [result];
  }

  result.parties = [potentialWinner.party];
  return [result];
}
