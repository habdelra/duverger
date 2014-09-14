import Ember from 'ember';
import districtOneFixture from '../models/district-one-fixture';
import chartConstants from '../utils/chart-constants';

export default Ember.Route.extend({
  model: function() {
    return {
      preferenceParties: districtOneFixture(),
      diameter: chartConstants().height
    };
  }
});
