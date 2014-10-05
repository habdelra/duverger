import Ember from 'ember';

var set = Ember.set;
var get = Ember.get;

export default Ember.Component.extend({
  classNameBindings: [':left-hand-panel', 'isOpened:opened:closed'],

  isOpened: true,

  actions: {
    toggleLeftHandPanel: function() {
      set(this, 'isOpened', !get(this, 'isOpened'));
    }
  }
});
