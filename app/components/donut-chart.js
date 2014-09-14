/* globals d3 */

import Ember from 'ember';
import partyLookup from '../utils/party-lookup';

var get = Ember.get;
var observer = Ember.observer;
var computed = Ember.computed;

export default Ember.Component.extend({
  pie: d3.layout.pie()
    .value(function(d) {
      return d[Ember.keys(d)];
    })
    .sort(null),

  radius: computed('diameter', function() {
    var diameter = get(this, 'diameter');
    return diameter / 2;
  }),

  outerRadius: computed('radius', function() {
    var radius = get(this, 'radius');
    return radius;
  }),

  innerRadius: computed('radius', function() {
    var radius = get(this, 'radius');
    return radius - 118;
  }),

  arc: computed('height', 'width', function() {
    var innerRadius = get(this, 'innerRadius');
    var outerRadius = get(this, 'outerRadius');
    return d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  }),

  voteData: computed('data.@each.votePercentage', function() {
    var preferenceGroups = get(this, 'data');
    return preferenceGroups.map(function(preferenceGroup) {
      var primaryPreferenceParty = preferenceGroup.preferences[0].party;
      var result = {};
      result[primaryPreferenceParty] = preferenceGroup.votePercentage;
      return result;
    });
  }),

  arcTween: function(a) {
    var i = d3.interpolate(this._current, a);
    var arc = get(this, 'arc');
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  },

  draw: function() {
    var diameter = get(this, 'diameter');
    var innerRadius = get(this, 'innerRadius');
    var data = get(this, 'voteData');
    var arc = get(this, 'arc');
    var pie = this.pie;

    var svg = d3.select(get(this, 'element')).append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", innerRadius)
      .attr("fill", "#ffffff");

    svg.datum(data).selectAll("path")
      .data(pie)
      .enter().append("path")
      .attr("fill", function(d) {
        return partyLookup(Ember.keys(d.data), 'color');
      })
      .attr("d", arc)
      .each(function(d) { this._current = d; }); // store the initial angles

  }.on('didInsertElement'),

  dataChanged: observer('voteData.@each', function() {
    var _this = this;
    var pie = this.pie;
    var data = get(this, 'voteData');
    var svg = d3.select(get(this, 'element')).select('g');
    var path = svg.selectAll('path');
    var arcTween = function(a) {
      var i = d3.interpolate(this._current, a);
      var arc = get(_this, 'arc');
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    };

    path = path.data(pie(data)); // compute the new angles
    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
  })
});
