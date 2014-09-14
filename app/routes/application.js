import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return {
      testData: [
        { liberal: 3 },
        { socialDemocrat: 4 },
        { conservative: 16 },
        { green: 15 },
        { nationalist: 9 }
      ],
      partyPreferenceGroups: [{
        preferences: [{
          index: 0,
          abbreviation: 'SD',
          name: 'Social Democrat'
        },{
          index: 1,
          abbreviation: 'C',
          name: 'Conservative'
        },{
          index: 2,
          abbreviation: 'G',
          name: 'Green'
        },{
          index: 3,
          abbreviation: 'N',
          name: 'Nationalist'
        },{
          index: 4,
          abbreviation: 'L',
          name: 'Liberal'
        }]
      },{
        preferences: [{
          index: 0,
          abbreviation: 'L',
          name: 'Liberal'
        },{
          index: 1,
          abbreviation: 'SD',
          name: 'Social Democrat'
        },{
          index: 2,
          abbreviation: 'C',
          name: 'Conservative'
        },{
          index: 3,
          abbreviation: 'G',
          name: 'Green'
        },{
          index: 4,
          abbreviation: 'N',
          name: 'Nationalist'
        }]
      },{
        preferences: [{
          index: 0,
          abbreviation: 'N',
          name: 'Nationalist'
        },{
          index: 1,
          abbreviation: 'L',
          name: 'Liberal'
        },{
          index: 2,
          abbreviation: 'SD',
          name: 'Social Democrat'
        },{
          index: 3,
          abbreviation: 'C',
          name: 'Conservative'
        },{
          index: 4,
          abbreviation: 'G',
          name: 'Green'
        }]
      },{
        preferences: [{
          index: 0,
          abbreviation: 'G',
          name: 'Green'
        },{
          index: 1,
          abbreviation: 'N',
          name: 'Nationalist'
        },{
          index: 2,
          abbreviation: 'L',
          name: 'Liberal'
        },{
          index: 3,
          abbreviation: 'SD',
          name: 'Social Democrat'
        },{
          index: 4,
          abbreviation: 'C',
          name: 'Conservative'
        }]
      },{
        preferences: [{
          index: 0,
          abbreviation: 'C',
          name: 'Conservative'
        },{
          index: 1,
          abbreviation: 'G',
          name: 'Green'
        },{
          index: 2,
          abbreviation: 'N',
          name: 'Nationalist'
        },{
          index: 3,
          abbreviation: 'L',
          name: 'Liberal'
        },{
          index: 4,
          abbreviation: 'SD',
          name: 'Social Democrat'
        }]
      }]

    };
  }

});
