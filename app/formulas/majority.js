import Ember from 'ember';

var get = Ember.get;
var emberA = Ember.A;

export default function(preferenceGroups) {
  var runoffs = emberA([]);
  var majorityReached = false;
  var deadTieInRunoff = false;
  var preferenceGroupsArray = emberA(preferenceGroups);
  var totalVoters = preferenceGroupsArray.reduce(function(sum, preferenceGroup) {
    return preferenceGroup.voters + sum;
  }, 0);
  var majorityOfVotes = Math.floor(totalVoters / 2) + 1;

  var generateVoterSummary = function(partyTotal) {
    var summary = {};
    summary[partyTotal.party] = partyTotal.voters;
    return summary;
  };

  var preferredPartyTotalsMapping = function(preferenceGroup) {
    var primaryPartyPreference = preferenceGroup.preferences[0].party;
    return {
      party: primaryPartyPreference,
      voters: preferenceGroup.voters
    };
  };

  var processPartyPreferencesForRunoff = function() {
    var sortedPartyTotals = emberA([]);

    var allPreferredParties = preferenceGroupsArray.map(preferredPartyTotalsMapping);
    // initialize the runoffResults object which will hold the results of the runoff tally
    var runoffParties = get(runoffs, 'lastObject.parties');
    var runoffResults = {};
    allPreferredParties.forEach(function(partyInfo) {
      runoffResults[partyInfo.party] = 0;
    });

    preferenceGroupsArray.forEach(function(preferenceGroup) {
      var preferences = preferenceGroup.preferences;
      for(var i = 0; i < preferences.length; i++) {
        var currentPreferredParty = preferences[i].party;
        if (runoffParties.contains(currentPreferredParty)) {
          runoffResults[currentPreferredParty] += preferenceGroup.voters;
          break; //super important to the model that we stop processing the party preferences when we find a match
        }
      }
    });

    //create a sortedPartyTotals object so you can consistenly add to the runoffs array
    //using the logic in the do loop below
    allPreferredParties.forEach(function(partyInfo) {
      sortedPartyTotals.push({
        party: partyInfo.party,
        voters: runoffResults[partyInfo.party]
      });
    });
    return sortedPartyTotals.sortBy('voters');
  };

  // iterate thru all the runoffs (in this model there really should be a single runoff election)
  do {
    var sortedPartyTotals = emberA([]);
    var numberOfRunoffs = get(runoffs, 'length');
    //in the case of a runoff, start marching down the party preference list until
    //you reach a match with one of the runoff parties--then use those voters from the group
    //in for the matched runoff party's total vote
    if (numberOfRunoffs > 0) {
      sortedPartyTotals = processPartyPreferencesForRunoff();
    } else {
      sortedPartyTotals = preferenceGroupsArray.map(preferredPartyTotalsMapping).sortBy('voters');
    }

    var potentialWinner = get(sortedPartyTotals, 'lastObject');
    var numberOfParties = get(sortedPartyTotals, 'length');

    majorityReached = potentialWinner.voters >= majorityOfVotes;

    var parties = [potentialWinner.party];
    if (!majorityReached) {
      //just grabbing the 2nd to last item in array regardless if there was a tie for second place
      var runnerup = sortedPartyTotals.objectAt(numberOfParties - 2);
      if (runnerup.voters === potentialWinner.voters && numberOfRunoffs > 0) {
        //this is the scenario where there was a dead tie after the runoff election
        //In this case, reaching a majority is impossible, as all subsequent runoffs
        //will come to the same outcome, and your computer will melt.
        deadTieInRunoff = true;
        parties = emberA([]); //use an emtpy array to indicate an unresolveable tie
      } else {
        parties.push(sortedPartyTotals.objectAt(numberOfParties - 2).party);
      }
    }
    var voterSummary = sortedPartyTotals.map(generateVoterSummary);

    runoffs.push({
      voterSummary : voterSummary,
      parties: parties
    });

  } while(!majorityReached && !deadTieInRunoff);

  return runoffs;
}
