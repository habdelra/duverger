import Ember from 'ember';

export default Ember.Component.extend({
  movePreferenceBefore: 'movePreferenceBefore',
  movePreferenceAfter:  'movePreferenceAfter',

  actions: {
    movePreferenceBefore: function() {
      this.sendAction('movePreferenceBefore');
    },

    movePreferenceAfter: function() {
      this.sendAction('movePreferenceAfter');
    },
  }
});
