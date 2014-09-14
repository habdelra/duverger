import Ember from 'ember';
import districtOneFixture from '../models/district-one-fixture';

export default Ember.Route.extend({
  model: function() {
    return {
      preferenceParties: districtOneFixture(),
      diameter: 495
    };
  }
});
