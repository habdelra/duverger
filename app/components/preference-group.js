import Ember from 'ember';

var set = Ember.set;
var get = Ember.get;
var computed = Ember.computed;
var alias = computed.alias;

export default Ember.Component.extend({
  classNameBindings: [':preference-group', 'primaryPreferenceParty'],

  preferences: alias('preferenceGroup.preferences'),

  primaryPreference: computed('preferences', function() {
    var primaryPreference = get(this, 'preferences.firstObject');
    return primaryPreference;
  }),

  primaryPreferenceParty: computed('primaryPreference.party', function(){
    var party = get(this, 'primaryPreference.party');
    return party;
  }),

  _reindexChildren: function() {
    var _this = this;
    var preferences = get(this, 'preferences');
    preferences.forEach(function(party, index) {
      set(_this, 'preferences.' + index + '.index', index);
    });
  },

  actions: {
    dragStarted: function() {
      set(this, 'isDragging', true);
    },
    dragEnded: function() {
      set(this, 'isDragging', false);
    },
    reorder: function(ordering) {
      set(this, 'isDragging', false);
      var preferences = get(this, 'preferences');
      var party = preferences.objectAt(ordering.partyIndex);
      preferences.removeAt(ordering.partyIndex);
      var newIndex = ordering.partyIndex < ordering.dropZoneIndex ? ordering.dropZoneIndex - 1: ordering.dropZoneIndex;
      preferences.insertAt(newIndex, party);
      set(this, 'preferences', preferences);
      this._reindexChildren();
    }
  }
});
