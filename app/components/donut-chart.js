/* globals d3 */

import Ember from 'ember';
import partyLookup from '../utils/party-lookup';
import chartConstants from '../utils/chart-constants';

var get = Ember.get;
var set = Ember.set;
var observer = Ember.observer;
var computed = Ember.computed;
var mapBy = computed.mapBy;
var sum = computed.sum;
var later = Ember.run.later;

var donutMargin = chartConstants().donutMargin;
var transitionDurationMs = chartConstants().transitionDurationMs;
var donutThickness = chartConstants().donutThickness;
var textOffset = chartConstants().textOffset;

export default Ember.Component.extend({
  classNames: 'donut-chart',

  votesArray: mapBy('data', 'votes'),
  overallVoteTotal: sum('votesArray'),

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
    return radius - donutMargin;
  }),

  innerRadius: computed('radius', function() {
    var radius = get(this, 'radius');
    return radius - donutThickness - donutMargin;
  }),

  arc: computed('height', 'width', function() {
    var innerRadius = get(this, 'innerRadius');
    var outerRadius = get(this, 'outerRadius');
    return d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  }),

  voteData: computed('data.@each.votes', function() {
    var preferenceGroups = get(this, 'data');
    return preferenceGroups.map(function(preferenceGroup) {
      var primaryPreferenceParty = preferenceGroup.preferences[0].party;
      var result = {};
      result[primaryPreferenceParty] = preferenceGroup.votes;
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

    this.updateLines();

  }.on('didInsertElement'),

  updateLines: function() {
    var _this = this;
    var pie = this.pie;
    var data = get(this, 'voteData');
    var outerRadius = get(this, 'outerRadius');
    var overallVoteTotal = get(this, 'overallVoteTotal');
    var svg = d3.select(get(this, 'element')).select('g');
    var lines = svg.selectAll("line").data(pie(data));

    var textTween = function(d, i) {
      var a;
      var pieData = get(_this, 'oldPieData');
      if(pieData && pieData[i]){
        a = (pieData[i].startAngle + pieData[i].endAngle - Math.PI)/2;
      } else if(pieData && !(pieData[i]) && pieData[i-1]) {
        a = (pieData[i-1].startAngle + pieData[i-1].endAngle - Math.PI)/2;
      } else if(pieData && !(pieData[i-1]) && pieData.length > 0) {
        a = (pieData[pieData.length-1].startAngle + pieData[pieData.length-1].endAngle - Math.PI)/2;
      } else {
        a = 0;
      }
      var b = (d.startAngle + d.endAngle - Math.PI)/2;

      var fn = d3.interpolateNumber(a, b);
      return function(t) {
        var val = fn(t);
        return "translate(" + Math.cos(val) * (outerRadius+textOffset) + "," + Math.sin(val) * (outerRadius+textOffset) + ")";
      };
    };

    var afterTextTween = function(d, i) {
      var preferenceGroupsAmount = get(_this, 'data.length');
      if (i === preferenceGroupsAmount - 1) {
        set(_this, 'oldPieData', pie(data));
      }
    };

    lines.enter().append("svg:line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", -outerRadius+18)
      .attr("y2", -outerRadius-13)
      .attr("stroke", "#333333")
      .attr("marker-start", "url(#circ)")
      .attr("transform", function(d) {
        return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
      });
    lines.transition()
      .duration(transitionDurationMs)
      .attr("transform", function(d) {
        return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
      });
    lines.exit().remove();

    var defs = svg.selectAll("defs")
      .data(pie(data));
    defs.enter().append("defs");
    defs.exit().remove();

    var marker = defs.select("marker#circ");
    if (marker.empty() ) {
      defs.append("marker")
      .attr("id", "circ")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("refX", 3)
      .attr("refY", 3)
      .append("circle")
      .attr("cx", 3)
      .attr("cy", 3)
      .attr("r", 3);
    }

    var valueLabels = svg.selectAll("text.value")
      .data(pie(data))
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 15;
        } else {
          return -7;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
          return "beginning";
        } else {
          return "end";
        }
      })
      .text(function(d){
        var percentage = (d.value/overallVoteTotal)*100;
        return percentage.toFixed(1) + "%";
      });

    valueLabels.enter().append("svg:text")
      .attr("class", "value vote-percentage")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (outerRadius+textOffset) +
          "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (outerRadius+textOffset) + ")";
      })
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
          return 15;
        } else {
          return -7;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 < Math.PI ){
          return "beginning";
        } else {
          return "end";
        }
      })
      .text(function(d){
        var percentage = (d.value/overallVoteTotal)*100;
        return percentage.toFixed(1) + "%";
      });

    valueLabels
      .transition()
      .duration(transitionDurationMs)
      .attrTween("transform", textTween)
      .each("end", afterTextTween);
    valueLabels.exit().remove();
  },

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
    path.transition().duration(transitionDurationMs).attrTween("d", arcTween); // redraw the arcs

    later(function() {
      _this.updateLines();
    });
  })
});
