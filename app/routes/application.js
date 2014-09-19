import Ember from 'ember';
import districtOneFixture from '../models/district-one-fixture';
import chartConstants from '../utils/chart-constants';

export default Ember.Route.extend({
  _getFixtureData: function(){
    return districtOneFixture();
  },

  model: function() {
    var formulaName = 'majority';
    var data = this._getFixtureData();

    return {
      formulaName: formulaName,
      districtNumber: data.districtNumber,
      districtName: data.districtName,
      preferenceGroups: data.preferenceGroups,
      diameter: chartConstants().height
    };
  }
});
