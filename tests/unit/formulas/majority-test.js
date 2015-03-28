import { test, moduleFor } from 'ember-qunit';
import majority from '../../../formulas/majority';

var originalRandomFunction;

module('formula:majority', {
  setup: function() {
    originalRandomFunction = Math.random;
    //need to fake randomness so that we can make deterministic assertions in the tests
    Math.random = function() {
      return 0;
    };
  },
  teardown: function() {
    Math.random = originalRandomFunction;
  }
});

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
    winners: ['republican'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: [{"green": 1}],
      democrat: [{"democrat":48}],
      republican: [{"republican":51}]
    },
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
    winners: ['republican', 'democrat'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: [{'green': 9}],
      democrat: [{'democrat':40}],
      republican: [{'republican': 41}]
    },
    voterSummary: [{
      green: 9
    },{
      democrat: 40
    },{
      republican: 41
    }]
  },{
    winners: ['democrat'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: [{'democrat':9}],
      democrat: [{'democrat':40}],
      republican: [{'republican': 41}]
    },
    voterSummary: [{
      green: 9
    },{
      democrat: 40
    },{
      republican: 41
    }]
  }];

  var actual = majority(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});

test('tie for 1st place in first round election', function() {
  expect(1);

  var voterData = [{
    voters: 30,
    preferences: [{
      party: 'republican'
    },{
      party: 'democrat'
    }]
  },{
    voters: 40,
    preferences: [{
      party: 'democrat'
    }]
  },{
    voters: 40,
    preferences: [{
      party: 'green'
    }]
  }];

  var expected = [{
    winners: ['democrat', 'green'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: [{'green':40}],
      democrat: [{'democrat':40}],
      republican: [{'republican': 30}]
    },
    voterSummary: [{
      republican: 30
    },{
      democrat: 40
    },{
      green: 40
    }]
  },{
    winners: ['democrat'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: [{'green':40}],
      democrat: [{'democrat':40}],
      republican: [{'democrat':30}]
    },
    voterSummary: [{
      republican: 30
    },{
      democrat: 40
    },{
      green: 40
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
    winners: ['republican', 'green'],
    coinToss: {
      participants: ['democrat', 'green'],
      winners: ['green']
    },
    votedFor: {
      green: [{'green':30}],
      democrat: [{'democrat':30}],
      republican: [{'republican':40}]
    },
    voterSummary: [{
      democrat: 30
    },{
      green: 30
    },{
      republican: 40
    }]
  },{
    winners: ['green'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: [{'green': 30}],
      democrat: [{'green': 30}],
      republican: [{'republican': 40}]
    },
    voterSummary: [{
      democrat: 30
    },{
      green: 30
    },{
      republican: 40
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
    winners: ['democrat', 'green'],
    coinToss: {
      participants: ['republican', 'democrat', 'green'],
      winners: ['democrat', 'green']
    },
    votedFor: {
      green: [{'green': 30}],
      democrat: [{'democrat': 30}],
      republican: [{'republican': 30}]
    },
    voterSummary: [{
      republican: 30
    },{
      democrat: 30
    },{
      green: 30
    }]
  },{
    winners: ['democrat'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: [{'green': 30}],
      democrat: [{'democrat': 30}],
      republican: [{'democrat': 30}]
    },
    voterSummary: [{
      republican: 30
    },{
      democrat: 30
    },{
      green: 30
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
    winners: ['republican', 'democrat'],
    coinToss: {
      participants: [],
      winners: []
    },
    votedFor: {
      green: [{'green': 10}],
      democrat: [{'democrat': 30}],
      republican: [{'republican':30}],
      teaparty: [{'teaparty': 10}]
    },
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
    winners: ['democrat'],
    coinToss: {
      participants: ['republican', 'democrat'],
      winners: ['democrat']
    },
    votedFor: {
      green: [{'democrat': 10}],
      democrat: [{'democrat': 30}],
      republican: [{'republican':30}],
      teaparty: [{'republican': 10}]
    },
    voterSummary: [{
      green: 10
    },{
      teaparty: 10
    },{
      republican: 30
    },{
      democrat: 30
    }]
  }];

  var actual = majority(voterData);
  deepEqual(actual, expected, 'the formula is correct');
});


// test('sincerety affects outcomes', function() {
  // expect(1);

  // var voterData = [{
    // voters: 40,
    // preferences: [{
      // party: 'socialist'
    // }]
  // },{
    // voters: 30,
    // preferences: [{
      // party: 'conservative'
    // }]
  // },{
    // voters: 15,
    // preferences: [{
      // party: 'green'
    // }]
  // },{
    // voters: 10,
    // sincerety: 60,
    // preferences: [{
      // party: 'liberal'
    // },{
      // party: 'green'
    // },{
      // party: 'conservative'
    // },{
      // party: 'socialist'
    // },{
      // party: 'nationalist'
    // }]
  // },{
    // voters: 5,
    // preferences: [{
      // party: 'nationalist'
    // }]
  // }];

  // var expected = [{
    // winners: ['socialist'],
    // coinToss: {
      // participants: [],
      // winners: []
    // },
    // votedFor: {
      // green: [{ 'green': 15 }],
      // liberal: [{'liberal': 6}, { 'conservative': 4 }] ,
      // conservative: 'conservative',
      // socialist: 'socialist',
      // nationalist: 'nationalist'
    // },
    // voterSummary: [{
      // green: 15
    // },{
      // liberal: 6
    // },{
      // conservative: 34
    // },{
      // socialist: 40
    // },{
      // nationalist: 5
    // }]
  // }];

  // var actual = majority(voterData);
  // deepEqual(actual, expected, 'the formula is correct');
// });

