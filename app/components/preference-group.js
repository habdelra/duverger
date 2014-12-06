import Ember from 'ember';

var set = Ember.set;
var get = Ember.get;
var empty = Ember.empty;
var computed = Ember.computed;
var alias = computed.alias;
var not = computed.not;

export default Ember.Component.extend({
  recalculateElectionOutcome: 'recalculateElectionOutcome',
  partyAtBeginning: 'partyAtBeginning',
  partyAtEnd: 'partyAtEnd',
  partyAtMiddle: 'partyAtMiddle',

  classNameBindings: [':preference-group', 'primaryPreferenceParty'],

  voters: alias('preferenceGroup.voters'),
  hasNoVoters: not('voters'),
  preferences: alias('preferenceGroup.preferences'),

  votersDisplay: computed('voters', function(key, value) {
    if (arguments.length > 1) {
      value = isNaN(value) || empty(value) ? 0 : value;
      var votersInteger = parseInt(value, 10);
      votersInteger = votersInteger < 0 ? 0 : votersInteger;
      set(this, 'voters', votersInteger);
    } else {
      return get(this, 'voters');
    }
  }),

  percentage: computed('voters', 'totalVoters', function() {
    var voters = get(this, 'voters');
    var totalVoters = get(this, 'totalVoters');
    return Math.floor(( voters / totalVoters ) * 1000 + 0.5) / 10;
  }),

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
    incrementVoterAmount: function() {
      var voters = get(this, 'voters');
      set(this, 'voters', ++voters);
    },
    decrementVoterAmount: function() {
      var voters = get(this, 'voters');
      if (voters) {
        set(this, 'voters', --voters);
      }
    },
    wasClicked: function(party) {
      var primaryParty = get(this, 'preferences.firstObject.party');
      var offset = this.$().offset();
      var height = this.$().height();
      var width =  this.$().width();
      var top = offset.top + (height / 2) + 5;
      var left = offset.left + (width / 2) + 40;
      var style = 'top:' + top + 'px; left:' + left + 'px;';

      set(this, 'preferenceIsMoving', { primaryParty: primaryParty, party: party });
      set(this, 'preferenceOrderStyle', style);
    },
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

      // "unplug" the observers while all the changes are made
      preferences.beginPropertyChanges();
      preferences.removeAt(ordering.partyIndex);
      var newIndex = ordering.partyIndex < ordering.dropZoneIndex ? ordering.dropZoneIndex - 1: ordering.dropZoneIndex;
      preferences.insertAt(newIndex, party);
      set(this, 'preferences', preferences);
      this._reindexChildren();
      preferences.endPropertyChanges();

      this.sendAction('recalculateElectionOutcome');
    },

    partyAtBeginning: function() {
      this.sendAction('partyAtBeginning');
    },

    partyAtMiddle: function() {
      this.sendAction('partyAtMiddle');
    },

    partyAtEnd: function() {
      this.sendAction('partyAtEnd');
    }
  }
});
