import Ember from 'ember';

export default function(formulaName, container){
  var resolverName = 'formula:' + formulaName;
  var formula = container.lookupFactory(resolverName);
  Ember.assert('The formula `' + resolverName + '` must exist and be of type `function`', typeof formula === 'function');
  return formula;
}
