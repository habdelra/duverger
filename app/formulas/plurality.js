import Ember from 'ember';

var get = Ember.get;
var emberA = Ember.A;

// preferenceGroups data is in the form of:
// an array of preference groups where inside each preference group is
// a voters fields for the amount of voters, and a preferences array which
// is an array of party preferences.
//
//   e.g.
//   ```
//    var voterdata = [{
//      voters: 20,
//      preferences: [{
//        party: 'socialdemocrat'
//      },{
//        party: 'green'
//      }]
//    },{
//      voters: 20,
//      preferences: [{
//        party: 'conservative'
//      },{
//        party: 'nationalist'
//      }]
//    },{
//      voters: 5,
//      preferences: [{
//        party: 'green'
//      },{
//        party: 'socialdemocrat'
//      }]
//    }];
//   ```

export default function(preferenceGroups){
  var result = {};
  var preferenceGroupsArray = emberA(preferenceGroups);

  // create an array `sortedPartyTotals` based on the preferencesGroups array that is re-mapped
  // to return the primary party for each preference group and the number of voters. This new array
  // is then sorted in ascending order to the party with the most votes is the last item in the array.
  var sortedPartyTotals = preferenceGroupsArray.map(function(preferenceGroup) {
    var primaryPartyPreference = preferenceGroup.preferences[0].party;
    return {
      party: primaryPartyPreference,
      voters: preferenceGroup.voters
    };
  }).sortBy('voters');

  // create summary of the votes that is used throughout the application based on the `sortedPartyTotals` array
  // As well as, create a mapping that describes for which party each group voted. In the case of this formula,
  // this will be an identity matrix.
  result.votedFor = {};
  result.voterSummary = sortedPartyTotals.map(function(partyTotal) {
    var summary = {};
    var party = partyTotal.party;
    summary[party] = partyTotal.voters;
    result.votedFor[party] = party;
    return summary;
  });

  // the winning party in the election is the last item in the `sortedPartyTotals` array (since it is sorted by voters)
  var potentialWinner = get(sortedPartyTotals, 'lastObject');
  var numberOfParties = get(sortedPartyTotals, 'length');

  // in the case where the 2nd to last item in the `sortedPartyTotals` array has the same amount of voters as the
  // last item in `sortedPArtyTotals`, then there has been a tie. Return an emtpty `parties` array in the
  // result to indicate that a tie has occured.
  if(numberOfParties > 1 && potentialWinner.voters === sortedPartyTotals.objectAt(numberOfParties - 2).voters) {
    result.parties = [];//for now an empty array means tied
    return [result];
  }

  // Otherwise, if there is no tie, set the winning party in the `parties` array in the result
  result.parties = [potentialWinner.party];

  // the result is returned as an array, where each item in the array represents a separate round of elections.
  // for the plurality formula, there is currently only round round of elections ever, so just return an array of one item.
  return [result];
}
