'use strict';

require('./route/route.js');
require('./controllers');
require('./services');

module.exports = angular.module('funApp',[
  'app.services',
  'app.route',
  'app.controllers'
]);
