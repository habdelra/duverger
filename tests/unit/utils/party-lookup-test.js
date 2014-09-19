import { test, moduleFor } from 'ember-qunit';
import partyLookup from '../../../utils/party-lookup';

module('util:party-lookup');

test('returns party info', function() {
  expect(3);

  equal(partyLookup('socialDemocrat', 'abbreviation'), 'SD');
  equal(partyLookup('socialDemocrat', 'name'), 'Social Democrat');
  equal(partyLookup('socialDemocrat', 'color'), '#FB5258');
});

