import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return [
      { liberal: 3 },
      { socialDemocrat: 4 },
      { conservative: 16 },
      { green: 15 },
      { nationalist: 9 }
    ];
  }
});
