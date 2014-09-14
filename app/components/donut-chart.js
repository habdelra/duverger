import Ember from 'ember';

var clickHandler = Ember.K;
var get = Ember.get;
var observer = Ember.observer;
var computed = Ember.computed;

  var timeout = setTimeout(function() {
    // d3.select("input[value=\"oranges\"]").property("checked", true).each(change);
  }, 2000);

  // function change() {
  // }


// function type(d) {
  // d.apples = +d.apples;
  // d.oranges = +d.oranges;
  // return d;
// }

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.

export default Ember.Component.extend({
  pie: d3.layout.pie().sort(null),

  arc: computed('height', 'width', function() {
    var width = get(this, 'width');
    var height = get(this, 'height');
    var radius = Math.min(width, height) / 2;
    return d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 20);
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
    var width = get(this, 'width');
    var height = get(this, 'height');
    var radius = Math.min(width, height) / 2;
    var data = get(this, 'data');
    var arc = get(this, 'arc');
    var pie = this.pie;

    var color = d3.scale.category20();

    var svg = d3.select(get(this, 'element')).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    var path = svg.datum(data).selectAll("path")
          .data(pie)
          .enter().append("path")
          .attr("fill", function(d, i) { return color(i); })
          .attr("d", arc)
          .each(function(d) { this._current = d; }); // store the initial angles

      // d3.selectAll("input")
          // .on("change", change);

    var el = get(this, 'element');
  }.on('didInsertElement'),

  dataChanged: observer('data.@each', function() {
    var _this = this;
    var pie = this.pie;
    var data = get(this, 'data');
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
