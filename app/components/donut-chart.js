/* globals d3 */

import Ember from 'ember';
import partyLookup from '../utils/party-lookup';
import chartConstants from '../utils/chart-constants';
import ElectionOutcomeMixin from '../mixins/election-outcome';

var get = Ember.get;
var set = Ember.set;
var observer = Ember.observer;
var computed = Ember.computed;
var keys = Ember.keys;
var next = Ember.run.next;

var donutMargin = chartConstants().donutMargin;
var transitionDurationMs = chartConstants().transitionDurationMs;
var donutThickness = chartConstants().donutThickness;
var textOffset = chartConstants().textOffset;

export default Ember.Component.extend(ElectionOutcomeMixin, {
  classNames: 'donut-chart',

  overallVoteTotal: computed('voterSummary', function() {
    var voterSummary = get(this, 'voterSummary');
    return voterSummary.reduce(function(sum, party) {
      return sum + party[keys(party)];
    }, 0);
  }),

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
    var data = get(this, 'voterSummary');
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
      .style({ 'stroke': 'white', 'stroke-width': '4px'})
      .attr("opacity", 0.35)
      .attr("fill", "#edebe0");

    svg.datum(data).selectAll("path")
      .data(pie)
      .enter().append("path")
      .attr("fill", function(d) {
        return partyLookup(Ember.keys(d.data), 'color');
      })
      .attr("d", arc)
      .style({ 'stroke': 'white', 'stroke-width': '1x'})
      .each(function(d) { this._current = d; });

    this.updateAnnotations();

  }.on('didInsertElement'),

  updateAnnotations: function() {
    var _this = this;
    var backgroundWidth = 50;
    var backgroundHeight = 20;
    var backgroundHorizontalCenterOffset = 5;
    var backgroundVerticalCenterOffset = -2;
    var pie = this.pie;
    var data = get(this, 'voterSummary');
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

    var textBackgroundTween = function(d, i) {
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
        var x = Math.cos(val) * (outerRadius+textOffset) + backgroundHorizontalCenterOffset;
        var y = Math.sin(val) * (outerRadius+textOffset) + backgroundVerticalCenterOffset;
        if (val > 0 && val < Math.PI + 0.01 ) {
          y += 15 - backgroundHeight/1.5;
        } else {
          y -= 7 + backgroundHeight/1.5;
        }

        if ( val > Math.PI/2 && val <= Math.PI*1.50 ){
          x -= backgroundWidth/1.125;
        } else {
          x -= backgroundWidth/4;
        }
        return 'translate(' + x + ',' + y + ')';
      };
    };

    var partyIndicatorTween = function(d, i) {
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
        var x = Math.cos(val) * (outerRadius+textOffset) + backgroundHorizontalCenterOffset;
        var y = Math.sin(val) * (outerRadius+textOffset) + backgroundVerticalCenterOffset;
        if (val > 0 && val < Math.PI + 0.01 ) {
          y += 15 - backgroundHeight/1.5;
        } else {
          y -= 7 + backgroundHeight/1.5;
        }

        if ( val > Math.PI/2 && val <= Math.PI*1.5 ){
          x -= backgroundWidth/1.125;
        } else {
          x -= backgroundWidth/4;
        }
        var upperRightHandX = x + backgroundWidth - 1;
        var upperRightHandY = y + 1;
        var triangeHeight = backgroundHeight * 0.5;
        var vertex1 = upperRightHandX + ',' + upperRightHandY;
        var vertex2 = (upperRightHandX - triangeHeight) + ',' + upperRightHandY;
        var vertex3 = upperRightHandX + ',' + (upperRightHandY + triangeHeight);
        return vertex1 + ' ' + vertex2 + ' ' + vertex3;
      };
    };

    var afterTextTween = function(d, i) {
      var preferenceGroupsAmount = get(_this, 'voterSummary.length');
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

    var textBackground = svg.selectAll('rect').data(pie(data));
    textBackground.enter().append('rect')
      .attr('width', backgroundWidth)
      .attr('height', backgroundHeight)
      .style('fill', 'white');

    textBackground
      .transition()
      .duration(transitionDurationMs)
      .attrTween("transform", textBackgroundTween);
    textBackground.exit().remove();

    var partyIndicator = svg.selectAll('polygon').data(pie(data));
    partyIndicator.enter().append('polygon')
      .attr("fill", function(d) {
        return partyLookup(Ember.keys(d.data), 'color');
      });

    partyIndicator
      .transition()
      .duration(transitionDurationMs)
      .attrTween("points", partyIndicatorTween);
    partyIndicator.exit().remove();

    var valueLabels = svg.selectAll("text.value")
      .data(pie(data))
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.501 ) {
          return 15;
        } else {
          return -7;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 <= Math.PI ){
          return "beginning";
        } else {
          return "end";
        }
      })
      .text(function(d){
        var percentage = Math.round((d.value/overallVoteTotal)*100);
        return percentage + "%";
      });

    valueLabels.enter().append("svg:text")
      .attr("class", "value vote-percentage")
      .attr("fill", "#777777")
      .attr("transform", function(d) {
        return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (outerRadius+textOffset) +
          "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (outerRadius+textOffset) + ")";
      })
      .attr("dy", function(d){
        if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.501 ) {
          return 15;
        } else {
          return -7;
        }
      })
      .attr("text-anchor", function(d){
        if ( (d.startAngle+d.endAngle)/2 <= Math.PI ){
          return "beginning";
        } else {
          return "end";
        }
      })
      .text(function(d){
        var percentage = Math.round((d.value/overallVoteTotal)*100);
        return percentage + "%";
      });

    valueLabels
      .transition()
      .duration(transitionDurationMs)
      .attrTween("transform", textTween)
      .each("end", afterTextTween);
    valueLabels.exit().remove();
  },

  dataChanged: observer('voterSummary.@each', function() {
    var _this = this;
    var pie = this.pie;
    var data = get(this, 'voterSummary');
    var votedFor = get(this, 'votedFor');
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
    path.transition().duration(transitionDurationMs)
      .attr("fill", function(d) {
        return partyLookup(votedFor[Ember.keys(d.data)], 'color');
      })
      .attrTween("d", arcTween); // redraw the arcs

    next(function(){
      _this.updateAnnotations();
    });
  })
});
