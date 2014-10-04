import { test, moduleFor } from 'ember-qunit';
import formulaeFixture from '../../../models/formulae-fixture';

module('model:formulae-fixture');

test('the initial formulae model data is correct', function(){
  expect(1);

  var expected = {
    formulae: [{
      value: 'majority',
      display: 'Majority'
    },{
      value: 'plurality',
      display: 'Plurality'
    }],
  };

  deepEqual(formulaeFixture(), expected, 'the model is correct');
});
