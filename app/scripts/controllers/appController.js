'use strict';

// @ngInject
module.exports = function ($scope,toastr){
  var vm = this;
  vm.name = 'fun';
  //$scope.name = 'fun';

  vm.sayHello = function(){
    //toastr.success('hello world', '提示');
    var str = '';
    vm.result = '';
    var arrays = ['kingsoft', 'KING', 'MI', 'mi', 'hello','e','aae','a'];
    arrays = _.sortBy(arrays, function(name) {return name;})
    _.each(arrays,function(data){
      vm.result = vm.result + '|' + data;
    })
    toastr.success(str, '提示');
  }

}
