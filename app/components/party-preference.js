import Ember from 'ember';
import partyLookup from '../utils/party-lookup';

var get = Ember.get;
var set = Ember.set;
var empty = Ember.empty;
var computed = Ember.computed;
var not = computed.not;
var alias = computed.alias;

export default Ember.Component.extend({
  dragStarted: 'dragStarted',
  dragEnded: 'dragEnded',

  classNameBindings: ['isFirstPreference:first-preference', 'isDragging:dragging', ':party-preference', 'party'],
  attributeBindings: ['draggable'],
  draggable: not('isFirstPreference'),
  party: alias('model.party'),

  votersDisplay: computed('voters', function(key, value) {
    if (arguments.length > 1) {
      value = empty(value) ? 0 : value;
      var votersInteger = parseInt(value, 10);
      set(this, 'voters', votersInteger);
    } else {
      return get(this, 'voters');
    }
  }),

  partyName: computed('party', function(){
    var party = get(this, 'party');
    return partyLookup(party, 'name');
  }),

  partyAbbreviation: computed('party', function(){
    var party = get(this, 'party');
    return partyLookup(party, 'abbreviation');
  }),

  isFirstPreference: computed('model.index', function() {
    var index = get(this, 'model.index');
    return index === 0;
  }),

  mimeType: computed('primaryPreference.party', function() {
    var primaryPreference = get(this, 'primaryPreference.party').toLowerCase();
    return 'text/x-preference-' + primaryPreference;
  }),

  setEventData: function(event) {
    var mimeType = get(this, 'mimeType');
    var model = get(this, 'model');
    var partyData = JSON.stringify(model);
    event.dataTransfer.setData(mimeType, partyData);
  }.on('dragStart'),

  dragStart: function(){
    var _this = this;
    this.sendAction('dragStarted');

    // Cos HTML5 draggables are st000pidddd
    // the HTML% drag n drop takes a picture of the original node to use as the
    // draggable thing, but you need to wait a little bit so that it doesn't take a picture
    // of placeholder element.
    Ember.run.later(function(){
      set(_this, 'isDragging', true);
    }, 100);
  },
  dragEnd: function() {
    set(this, 'isDragging', false);
    this.sendAction('dragEnded');
  }
});
