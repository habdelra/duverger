import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import './helpers/navigation';
import './helpers/assert-chart';

setResolver(resolver);
