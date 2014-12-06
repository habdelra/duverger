import Ember from 'ember';
import partyLookup from '../utils/party-lookup';

var get = Ember.get;
var set = Ember.set;
var computed = Ember.computed;
var on = Ember.on;
var alias = computed.alias;
var observer = Ember.observer;

var preferenceMoveMap = {
  previous: -1,
  after: 2
};

export default Ember.Component.extend({
  dragStarted: 'dragStarted',
  dragEnded: 'dragEnded',
  wasClicked: 'wasClicked',
  reorder: 'reorder',
  partyAtBeginning: 'partyAtBeginning',
  partyAtEnd: 'partyAtEnd',
  partyAtMiddle: 'partyAtMiddle',

  classNameBindings: ['isFirstPreference:first-preference', 'isDragging:dragging', 'isMoving:moving', ':party-preference', 'party'],
  attributeBindings: ['draggable'],
  party: alias('model.party'),

  click: function() {
    var party = get(this, 'party');
    var partyIndex = get(this, 'model.index');
    var preferencesCount = get(this, 'preferencesCount');

    set(this, 'isMoving', true);
    this.sendAction('wasClicked', party);

    if(partyIndex === 1) {
      this.sendAction('partyAtBeginning');
    } else if (partyIndex === (preferencesCount - 1)) {
      this.sendAction('partyAtEnd');
    } else {
      this.sendAction('partyAtMiddle');
    }
  },

  afterPreferenceIsMovingChanged: observer('preferenceIsMoving', function() {
    var preferenceIsMoving = get(this, 'preferenceIsMoving');

    if (!preferenceIsMoving) {
      set(this, 'isMoving', false);
    }
  }),

  draggable: computed('isFirstPreference', function() {
    var isFirstPreference = !get(this, 'isFirstPreference');
    return isFirstPreference + '';
  }),

  initialize: on('init', function() {
    var movingParty = get(this, 'preferenceIsMoving.party');
    var party = get(this, 'party');

    set(this, 'isMoving', movingParty === party);
  }),

  afterPreferenceMoveDirectionChanged: observer('preferenceMoveDirection', 'isMoving', function() {
    var preferenceMoveDirection = get(this, 'preferenceMoveDirection');
    var isMoving = get(this, 'isMoving');
    var partyIndex = get(this, 'model.index');
    var preferencesCount = get(this, 'preferencesCount');

    if (isMoving && preferenceMoveDirection) {
      var dropZoneIndex = partyIndex + preferenceMoveMap[preferenceMoveDirection];
      if (dropZoneIndex > 0 && dropZoneIndex <= preferencesCount) {
        this.sendAction('reorder', {
          partyIndex: partyIndex,
          dropZoneIndex: dropZoneIndex
        });

        if (dropZoneIndex === 1) {
          this.sendAction('partyAtBeginning');
        } else if (dropZoneIndex === preferencesCount) {
          this.sendAction('partyAtEnd');
        } else {
          this.sendAction('partyAtMiddle');
        }
      }
    }
    set(this, 'preferenceMoveDirection', null);
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
