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

export default function(preferenceGroups) {
  var runoffs = emberA([]);
  var majorityReached = false;
  var deadTieInRunoff = false;
  var preferenceGroupsArray = emberA(preferenceGroups);

  // Calculate the total amount of voters
  var totalVoters = preferenceGroupsArray.reduce(function(sum, preferenceGroup) {
    return preferenceGroup.voters + sum;
  }, 0);

  // Determine the majority of voters: one person more than half
  var majorityOfVotes = Math.floor(totalVoters / 2) + 1;

  // Summary function
  var generateVoterSummary = function(partyTotal) {
    var summary = {};
    summary[partyTotal.party] = partyTotal.voters;
    return summary;
  };

  // This function is used to generate the objects within an array of preferred parties for all the party groups
  var preferredPartyTotalsMapping = function(preferenceGroup) {
    var primaryPartyPreference = preferenceGroup.preferences[0].party;
    return {
      party: primaryPartyPreference,
      voters: preferenceGroup.voters
    };
  };

  // This function is used to process a runoff election
  var processPartyPreferencesForRunoff = function() {
    var sortedPartyTotals = emberA([]);

    // This is a list of all the primary parties
    var allPreferredParties = preferenceGroupsArray.map(preferredPartyTotalsMapping);

    // Initialize the runoffResults object which will hold the results of the runoff tally
    var runoffParties = get(runoffs, 'lastObject.parties');
    var runoffResults = {};
    allPreferredParties.forEach(function(partyInfo) {
      runoffResults[partyInfo.party] = 0;
    });

    // start marching down the party preference list until
    // you reach a match with one of the runoff parties--then use those voters from the group
    // in for the matched runoff party's total vote

    // Iterate through each of the preference groups
    preferenceGroupsArray.forEach(function(preferenceGroup) {
      var preferences = preferenceGroup.preferences;

      // iterate through all the party preferences in the preference group
      for(var i = 0; i < preferences.length; i++) {
        var currentPreferredParty = preferences[i].party;

        // check to see if the current party preference is one of the parties that has made it to the runoff election
        if (runoffParties.contains(currentPreferredParty)) {
          runoffResults[currentPreferredParty] += preferenceGroup.voters;
          // stop iterating through the group's party prefernces after adding the groups votes to the tally
          break; //super important to the model that we stop processing the party preferences when we find a match
        }
      }
    });

    // create a sortedPartyTotals object so you can consistenly add to the runoffs array
    // using the logic in the do loop below
    allPreferredParties.forEach(function(partyInfo) {
      sortedPartyTotals.push({
        party: partyInfo.party,
        voters: runoffResults[partyInfo.party]
      });
    });
    return sortedPartyTotals.sortBy('voters');
  };

  // This is the main loop. This iterates over all the elections (in this model there really should be a single runoff election)
  do {
    var sortedPartyTotals = emberA([]);

    // This is the current number of runoff elections
    var numberOfRunoffs = get(runoffs, 'length');

    // Check to see if this is a runoff election
    if (numberOfRunoffs > 0) {
      // If this is a runoff election then invoke the `processPartyPreferencesForRunoff` function (above)
      sortedPartyTotals = processPartyPreferencesForRunoff();
    } else {
      // If this is not a runoff election, then just sort the preferences group by the voters in each group (ascending order).
      // This will cause the winning parties to be the last two items in the array.
      sortedPartyTotals = preferenceGroupsArray.map(preferredPartyTotalsMapping).sortBy('voters');
    }

    // The potential winner of the election is the last item in the `sortedPartyTotals` array.
    var potentialWinner = get(sortedPartyTotals, 'lastObject');
    var numberOfParties = get(sortedPartyTotals, 'length');

    // Determine if a majority has been reached
    majorityReached = potentialWinner.voters >= majorityOfVotes;

    // Add the potentially winning party (the last item in the `sortedPartyTotals` array to the winning parties result of this election
    var parties = [potentialWinner.party];

    // If a majority has not been reached make sure there isn't a dead even tie
    if (!majorityReached) {
      // Grab the 2nd to last item in `sortedPartyTotals` array regardless if there was a tie for second place (this makes it easy)
      var runnerup = sortedPartyTotals.objectAt(numberOfParties - 2);
      if (runnerup.voters === potentialWinner.voters && numberOfRunoffs > 0) {
        // this is the scenario where there was a dead tie after the runoff election
        // In this case, reaching a majority is impossible, as all subsequent runoffs
        // will come to the same outcome, and your computer will melt.
        deadTieInRunoff = true;
        parties = emberA([]); // use an empty `parties` array to indicate an unresolveable tie for this election round
      } else {
        // If there is no dead even tie, then the runner up party is added to the `parties` array, which signifies the winning parties in this election round
        parties.push(sortedPartyTotals.objectAt(numberOfParties - 2).party);
      }
    }

    // generate a coterSummary list that is used throughout the aplication which summarizes this round of elections
    var voterSummary = sortedPartyTotals.map(generateVoterSummary);

    // Add the results from this round of elections to the array holding all the rounds of elections
    runoffs.push({
      voterSummary : voterSummary,
      parties: parties
    });

  // hold another round of elections if the majority has not been reached and there is not a dead tie in this round of elections
  } while(!majorityReached && !deadTieInRunoff);

  return runoffs;
}
