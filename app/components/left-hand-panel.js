import Ember from 'ember';

var set = Ember.set;
var get = Ember.get;
var computed = Ember.computed;
var equal = computed.equal;

export default Ember.Component.extend({
  classNameBindings: [':left-hand-panel', 'isOpened:opened:closed'],

  isOpened: true,
  slideNumber: 0,

  isFirstSlide: equal('slideNumber', 0),
  isLastSlide: equal('slideNumber', 4),

  visibleSlide: computed('slideNumber', function() {
    var slideNumber = get(this, 'slideNumber');

    return 'slide' + slideNumber + '-visible';
  }),

  actions: {
    toggleLeftHandPanel: function() {
      set(this, 'isOpened', !get(this, 'isOpened'));
    },

    incrementSlideNumber: function() {
      if (get(this, 'isLastSlide')) {
        return false;
      }

      set(this, 'slideNumber', (get(this, 'slideNumber') + 1));
    },

    decrementSlideNumber: function() {
      if (get(this, 'isFirstSlide')) {
        return false;
      }

      set(this, 'slideNumber', (get(this, 'slideNumber') - 1));
    }
  }
});
