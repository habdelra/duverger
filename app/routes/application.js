import Ember from 'ember';
import districtOneFixture from '../models/district-one-fixture';
import chartConstants from '../utils/chart-constants';

export default Ember.Route.extend({
  model: function() {
    var data = districtOneFixture();
    return {
      formula: 'proportional',
      districtNumber: data.districtNumber,
      districtName: data.districtName,
      preferenceGroups: data.preferenceGroups,
      diameter: chartConstants().height
    };
  }
});
