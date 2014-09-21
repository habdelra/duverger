import { test, moduleFor } from 'ember-qunit';
import majority from '../../../formulas/majority';

module('formula:majority');

test('winner in first round of elections', function(){
  expect(1);

  var voterData = [{
    voters: 51,
    preferences: [{
      party: 'republican'
    }]
  },{
    voters: 48,
    preferences: [{
      party: 'democrat'
    }]
  },{
    voters: 1,
    preferences: [{
      party: 'green'
    }]
  }];

  var expected = [{
    parties: ['republican'],
    voterSummary: [{
      green: 1
    },{
      democrat: 48
    },{
      republican: 51
    }]
  }];

  var actual = majority(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});

test('winner in runoff election', function() {
  expect(1);

  var voterData = [{
    voters: 41,
    preferences: [{
      party: 'republican'
    }]
  },{
    voters: 40,
    preferences: [{
      party: 'democrat'
    },{
      party: 'green'
    }]
  },{
    voters: 9,
    preferences: [{
      party: 'green'
    },{
      party: 'democrat'
    }]
  }];

  var expected = [{
    parties: ['republican', 'democrat'],
    voterSummary: [{
      green: 9
    },{
      democrat: 40
    },{
      republican: 41
    }]
  },{
    parties: ['democrat'],
    voterSummary: [{
      green: 0
    },{
      republican: 41
    },{
      democrat: 49
    }]
  }];

  var actual = majority(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});

test('tie for 2nd place in first round election', function() {
  expect(1);

  var voterData = [{
    voters: 40,
    preferences: [{
      party: 'republican'
    }]
  },{
    voters: 30,
    preferences: [{
      party: 'democrat'
    },{
      party: 'green'
    }]
  },{
    voters: 30,
    preferences: [{
      party: 'green'
    },{
      party: 'democrat'
    }]
  }];

  var expected = [{
    parties: ['republican', 'green'],
    voterSummary: [{
      democrat: 30
    },{
      green: 30
    },{
      republican: 40
    }]
  },{
    parties: ['green'],
    voterSummary: [{
      democrat: 0
    },{
      republican: 40
    },{
      green: 60
    }]
  }];

  var actual = majority(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});

test('3-way tie in first round election', function() {
  expect(1);

  var voterData = [{
    voters: 30,
    preferences: [{
      party: 'republican'
    },{
      party: 'democrat'
    }]
  },{
    voters: 30,
    preferences: [{
      party: 'democrat'
    },{
      party: 'green'
    }]
  },{
    voters: 30,
    preferences: [{
      party: 'green'
    },{
      party: 'democrat'
    }]
  }];

  var expected = [{
    parties: ['green', 'democrat'],
    voterSummary: [{
      republican: 30
    },{
      democrat: 30
    },{
      green: 30
    }]
  },{
    parties: ['democrat'],
    voterSummary: [{
      republican: 0
    },{
      green: 30
    },{
      democrat: 60
    }]
  }];

  var actual = majority(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});

test('tie in second round election', function() {
  expect(1);

  var voterData = [{
    voters: 30,
    preferences: [{
      party: 'republican'
    },{
      party: 'teaparty'
    }]
  },{
    voters: 30,
    preferences: [{
      party: 'democrat'
    },{
      party: 'green'
    }]
  },{
    voters: 10,
    preferences: [{
      party: 'green'
    },{
      party: 'democrat'
    }]
  },{
    voters: 10,
    preferences: [{
      party: 'teaparty'
    },{
      party: 'republican'
    }]
  }];

  var expected = [{
    parties: ['democrat', 'republican'],
    voterSummary: [{
      green: 10
    },{
      teaparty: 10
    },{
      republican: 30
    },{
      democrat: 30
    }]
  },{
    parties: [],
    voterSummary: [{
      green: 0
    },{
      teaparty: 0
    },{
      republican: 40
    },{
      democrat: 40
    }]
  }];

  var actual = majority(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});
