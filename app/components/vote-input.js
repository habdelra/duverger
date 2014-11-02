import Ember from 'ember';

export default Ember.TextField.extend({
  incrementVoterAmount: 'incrementVoterAmount',
  decrementVoterAmount: 'decrementVoterAmount',

  keyDown: function(e) {
    var keyCode = e.keyCode || e.which;
    var arrow = { left: 37, up: 38, right: 39, down: 40 };

    switch (keyCode) {
      case arrow.up:
      case arrow.right:
        this.sendAction('incrementVoterAmount');
      break;
      case arrow.down:
      case arrow.left:
        this.sendAction('decrementVoterAmount');
      break;
    }
  }
});
