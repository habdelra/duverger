import Ember from 'ember';
import districtOneFixture from '../models/district-one-fixture';
import formulaeFixture from '../models/formulae-fixture';
import chartConstants from '../utils/chart-constants';

var merge = Ember.merge;

export default Ember.Route.extend({
  _getFixtureData: function(){
    return merge(districtOneFixture(), formulaeFixture());
  },

  model: function() {
    var formulaName = 'majority';
    var data = this._getFixtureData();

    return {
      formulaName: formulaName,
      districtNumber: data.districtNumber,
      districtName: data.districtName,
      formulae: data.formulae,
      preferenceGroups: data.preferenceGroups,
      diameter: chartConstants().height
    };
  }
});
