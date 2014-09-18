import chartTypeLookup from '../utils/chart-type-lookup';

var donutSvgSelector = '.donut-chart svg';

export default function(chartName) {
  var chartDetails = chartTypeLookup(chartName);
  var expectedPartyColors = chartDetails.colors;
  var expectedText = chartDetails.text;

  var svg = find(donutSvgSelector);
  ok(svg.length, 'Chart SVG is displayed');

  var donutSegments = svg.find('path');
  equal(donutSegments.length, 5, 'there are 5 parties displayed in the chart');

  for(var i = 0; i < donutSegments.length; i++) {
    var donutSegment = find(donutSegments[i]);
    equal(donutSegment.attr('fill'), expectedPartyColors[i], 'donut segment color is correct');
  }

  var lines = svg.find('line');
  equal(lines.length, 5, 'there are 5 lines displayed in the chart');

  var texts = svg.find('text');
  equal(texts.length, 5, 'there are 5 text annotations displayed in the chart');

  for (i = 0; i < texts.length; i++) {
    var text = find(texts[i]);
    equal(text.text(), expectedText[i], 'the correct text annotation is displayed');
  }
}

