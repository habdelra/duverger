import { test, moduleFor } from 'ember-qunit';
import formulaLookup from '../../../utils/formula-lookup';
import resolver from '../../helpers/resolver';

var voterData = [{
  voters: 6,
  preferences: [{
    index:0,
    party: 'socialDemocrat'
  }]
},{
  voters: 5,
  preferences: [{
    index: 0,
    party: 'conservative'
  }]
},{
  voters: 4,
  preferences: [{
    index: 0,
    party: 'green'
  }, {
    index: 1,
    party: 'socialDemocrat'
  }]
}];

moduleFor('util:formula-lookup', 'util:formula-lookup', {
  setup: function(container){
    container.register('formula:plurality', resolver.resolve('formula:plurality'));
    container.register('formula:majority', resolver.resolve('formula:majority'));
  }
});

test('returns plurality formula function', function() {
  expect(2);

  var expectedResults = [{
    winners: ['socialDemocrat'],
    coinToss: {
      participants: [],
      winners:[]
    },
    votedFor: {
      conservative: 'conservative',
      green: 'green',
      socialDemocrat: 'socialDemocrat'
    },
    voterSummary: [{
      green: 4
    },{
      conservative: 5
    },{
      socialDemocrat: 6
    }]
  }];

  var formula = formulaLookup('plurality', this.container);
  var electionResults = formula(voterData);

  equal(typeof formula, 'function', 'formula is a function');
  deepEqual(electionResults, expectedResults, 'formula is correct');
});

test('returns majority formula function', function() {
  expect(2);

  var expectedResults = [{
    winners: ['socialDemocrat', 'conservative'],
    coinToss: {
      participants: [],
      winners:[]
    },
    votedFor: {
      conservative: 'conservative',
      green: 'green',
      socialDemocrat: 'socialDemocrat'
    },
    voterSummary: [{
      green: 4
    },{
      conservative: 5
    },{
      socialDemocrat: 6
    }]
  },{
    winners: ['socialDemocrat'],
    coinToss: {
      participants: [],
      winners:[]
    },
    votedFor: {
      conservative: 'conservative',
      green: 'socialDemocrat',
      socialDemocrat: 'socialDemocrat'
    },
    voterSummary: [{
      green: 4
    },{
      conservative: 5
    },{
      socialDemocrat: 6
    }]
  }];

  var formula = formulaLookup('majority', this.container);
  var electionResults = formula(voterData);

  equal(typeof formula, 'function', 'formula is a function');
  deepEqual(electionResults, expectedResults, 'formula is correct');
});

