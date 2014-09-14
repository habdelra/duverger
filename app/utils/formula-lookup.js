import Ember from 'ember';

export default function(formulaName, container){
  var resolverName = 'formula:' + formulaName;
  var formula= container.resolver(resolverName);
  Ember.assert('The forumla `' + resolverName + '` must exist and be of type `function`', typeof formula === 'function');
  return formula;
}
