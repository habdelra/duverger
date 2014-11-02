/* globals ic */
import Ember from 'ember';

var observer = Ember.observer;

ic.modal.ModalComponent.reopen({
  /*
     Applying the mainStyle property on the ic-modal-main element
   */
  setMainStyle: observer('mainStyle', function() {
    var style = this.get('mainStyle');
    if (!style) { return; }

    var $icModalMain = this.$().children('ic-modal-main');
    $icModalMain.attr('style', style);
    this.set('mainStyle', null);
  }),

});

ic.modal.ModalTriggerComponent.reopen({
  /*
   * This is blowing up when this.$() is undefined. Providing a guard for that.
   */
  focus: function() {
    if(this.element) {
      this.element.focus();
    }
  }
});
