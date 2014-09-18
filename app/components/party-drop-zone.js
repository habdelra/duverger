import Ember from 'ember';
import Droppable from 'ic-droppable';

var get = Ember.get;
var computed = Ember.computed;

export default Ember.Component.extend(Droppable, {
  reorder: 'reorder',

  classNameBindings: ['isDragging:can-accept-drop', ':preference-drop-zone'],

  index: computed('model.index', function() {
    var index = get(this, 'model.index');
    return index + 1;
  }),

  mimeType: computed('primaryPreference.abbreviation', function() {
    var primaryPreference = get(this, 'primaryPreference.party').toLowerCase();
    return 'text/x-preference-' + primaryPreference;
  }),

  validateDragEvent: function(event) {
    var mimeType = get(this, 'mimeType');
    return event.dataTransfer.types.contains(mimeType);
  },

  acceptDrop: function(event) {
    var mimeType = get(this, 'mimeType');
    var partyData = event.dataTransfer.getData(mimeType);
    var party = JSON.parse(partyData);
    var index = get(this, 'index');

    this.sendAction('reorder', {
      partyIndex: party.index,
      dropZoneIndex: index
    });
  }
});
