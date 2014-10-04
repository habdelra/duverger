import Ember from 'ember';

var on            = Ember.on;
var get           = Ember.get;
var hash          = Ember.RSVP.hash;
var setProperties = Ember.setProperties;
var schedule      = Ember.run.schedule;

export default Ember.Component.extend({
  tagName:             'select',
  prompt:               null,
  options:              null,
  initialValue:         null,
  resolvedOptions:      null,
  resolvedInitialValue: null,

  _resolvePromises: function() {
    var _this = this;

    hash({
      resolvedOptions:      get(this, 'options'),
      resolvedInitialValue: get(this, 'initialValue')
    })
    .then(function(resolvedHash){
      setProperties(_this, resolvedHash);

      //Run after render to ensure the <option>s have rendered
      schedule('afterRender', function() {
        _this.updateSelection();
      });
    });
  },

  afterSelectDataChanges: Ember.observer('options', 'initialValue', 'prompt', function() {
    this._resolvePromises();
  }),

  initializeSelect: on('init', function() {
    this._resolvePromises();
  }),

  updateSelection: function() {
    var initialValue      = get(this, 'resolvedInitialValue');
    var options           = get(this, 'resolvedOptions') || [];
    var initialValueIndex = options.mapBy('value').indexOf(initialValue);
    var hasSelection      = initialValueIndex > -1;
    var prompt            = get(this, 'prompt');

    if (prompt) {
      initialValueIndex++;
    }

    this.$('option').prop('selected', false);
    if (hasSelection) {
      this.$('option:eq(' + initialValueIndex + ')').prop('selected', true);
    } else if (prompt) {
      this.$('option:eq(0)').prop('selected', true);
    }
  },

  change: function() {
    this._changeSelection();
  },

  _changeSelection: function() {
    var value = this._selectedValue();

    this.sendAction('on-change', value);
  },

  _selectedValue: function() {
    var offset        = 0;
    var selectedIndex = this.$()[0].selectedIndex;

    if (this.prompt) { offset = 1; }

    return get(this, 'resolvedOptions')[selectedIndex - offset];
  }
});
