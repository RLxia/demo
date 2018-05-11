

angular.module('directive')

/*============================validation ui directives==========================*/
//非法字符校验
.directive('charValid', [function () {
    return {
        restrict: 'A',
        require: "?ngModel",
        link: function (scope, element, attr, ngModelCtrl) {
            if (!ngModelCtrl) return;

            ngModelCtrl.$validators.charValid = function(modelValue, viewValue) {
              var pattern = /[`~!@#$%^&*()+<>?:"{},.\/;\='[\]]/im;
              return !pattern.test(modelValue);
            }
        }
    };
}])
.directive('noDuplicate', [function () {
    return {
        restrict: 'A',
        require: "?ngModel",
        link: function (scope, element, attr, ctrl) {
            if (!ctrl) return;

            ctrl.$validators.noDuplicate = function(modelValue, viewValue) {
              if (scope['formData']) {
                var list = scope.formData['list'], tmp=[], names=[], curname=attr.name, formName=attr.formName;
                // Do not get model value to compare, because when validation is false, then model value is undefined.
                // Otherwise, to get viewValue to compare by element.
                var inputs = element.parent().parent().find('input');
                _.each(inputs, function(item,idx){
                    if ($(item).val()) tmp.push($(item).val());
                });
                // get names of input
                var keys = _.keys(list);
                _.each(keys, function(item,idx){
                    names.push(item);
                });
                if (tmp.length !== _.uniq(tmp).length) {
                  // if return false, angular will remove current form value from model, then the model value is undefined.
                  return false;
                } else {
                    // if has no duplication, need to clear other errors, rather then current form.
                    // trigger ng-message directive when clean error.
                    _.each(_.uniq(names), function(item, idx){
                        scope[formName][item]['$error'] = {};
                    });
                }
              }
              return true;
            }
        }
    };
}])

//动态表单不能重复
.directive('noRepeat',  [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attr, ngModel) {
            var items = [];
            scope.$watch(attr.ngModel, function (n) {
                if (scope.formData.domain_addr_pairs && scope.formData.domain_addr_pairs.length <=1) return;
                //萃取对象数组中某属性值,转为数组
                items = _.pluck(scope.formData.domain_addr_pairs, 'domain');
                //当前数组的长度与去重后数组的长度比较
                if(items.length == _.uniq(items).length) {
                    ngModel.$setValidity("noRepeat", true);
                    return;
                } else {
                    ngModel.$setValidity("noRepeat", false);
                    return;
                }
            });
        }
    };
}])
.directive('myMinLength', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var minlength = 0;
      attr.$observe('myminlength', function(value) {
        minlength = parseInt(value) || 0;
        ctrl.$validate();
      });
      ctrl.$validators.myminlength = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
      };
    }
  };
})
//ip验证
.directive('ipMatch',  [function () {
    return {
        restrict: 'A',
        require: "?ngModel",
        link: function (scope, element, attr, ctrl) {
            if (!ctrl) return;

            ctrl.$validators.ipmatch = function(modelValue, viewValue) {
              var patrn = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
              return ctrl.$isEmpty(viewValue) || patrn.test(modelValue);
            };
        }
    };
}])

.directive('editableMultiselect', ['editableDirectiveFactory', function (editableDirectiveFactory) {
      return editableDirectiveFactory({
          directiveName: 'editableMultiselect',
          inputTpl: '<select size="6" multiple></select>',
          autosubmit: function () {
              var self = this;
              self.inputEl.bind('change', function () {
                  self.scope.$apply(function () {
                      self.scope.$form.$submit();
                  });
              });
          }             
      });
}])
// .directive('toroidalProgress', ['$rootScope', function($rootScope) {
//   return {
//     restrict: 'EA',
//     scope: {
//       datainfo: '='
//     },
//     template: require('../views/module/toroidalProgress.html'),
//     link: function(scope, element, atttr) {
//       scope.$watch('datainfo', function() {
//         scope.percent=parseFloat(scope.datainfo) || 0;
//         scope.deg = 360*scope.percent/100;
//       })
//     }
//   }
// }])
/** 新分页指令*/
.directive('pageControl', [function() {
    return {
        restrict: 'EA',
        scope: {
            record: '=',
            evname: '@'
        },
        template: require('../views/module/page-control.html'),
        controller: ['$window','$rootScope','$scope', '$timeout', function($window, $rootScope, $scope, $timeout){
            var setPages = function (changedPageSize) {
                // 提交后更新操作的当前的页面和分页大小
                var dataPage = $scope.record;
                if (dataPage && dataPage.totalRecord && dataPage.data) {
                    $scope.pgs = {};
                    $scope.pgs.currentPg = dataPage.pageNo;
                    // only for watch
                    $scope.pgs.pageNo = dataPage.pageNo;
                    $scope.pgs.currentSize = changedPageSize || 3;
                    $scope.pgs.pageSize = $scope.record.pageSize;
                    $scope.pgs.lastPg = dataPage.totalPage-1;

                }
            };
            $scope.first = function($event) {
                if ($event) $event.preventDefault();
                if($scope.pgs.currentPg === 0) return;
                $scope.pgs.currentPg = 0;
            };
            $scope.prev = function($event) {
                if ($event) $event.preventDefault();
                if($scope.pgs.currentPg === 0) return;
                $scope.pgs.currentPg -=1;
            };
            $scope.next = function($event) {
                if ($event) $event.preventDefault();
                if($scope.pgs.currentPg >= $scope.pgs.lastPg) return;
                $scope.pgs.currentPg +=1;
            };
            $scope.last = function($event) {
                if ($event) $event.preventDefault();
                if($scope.pgs.currentPg === $scope.pgs.lastPg) return;
                $scope.pgs.currentPg = $scope.pgs.lastPg;
            };
            $scope.$watch('pgs.currentPg', function(newValue, oldValue){
              if (newValue) {
                $scope.$emit($scope.evname, newValue, $scope.pgs.pageSize);
              }
            });
            $scope.$watch('pgs.pageNo', function(newValue, oldValue){
              if (newValue) {
                $scope.pgs.currentPg = newValue;
              }
            });
            //监听模型初始化,完成后计算页面
            $scope.$on('modelInitialized', function(event,param){
                setPages();
            })

        }]
    };
}])
/*table header sort*/
// .directive('tbSort', ['MyUser', function(MyUser) {
//     var tpl = '<a class="title-position" ng-click="theadSort()">\
//                 <span ng-transclude></span>\
//                 <span class="icon-position both" ng-class=""></span>\
//                 </a>';
//     return {
//         restrict: 'EA',
//         template: require("../views/widgets/qk-table-sort.html"),
//         scope: true,
//         transclude: true,
//         controller: ['$rootScope','$scope', function($rootScope, $scope){
//             //current sort and column
//             $scope.$parent.curSort='',$scope.$parent.curCol='';
//             var curSort = '';
//             $scope.theadSort = function() {
//               $scope.$parent.curSort = getCurSort();
//               $scope.$parent.curCol = $scope.getColName();
//               $scope.$emit("sortEvent", $scope.$parent.curCol, $scope.$parent.curSort);
//             }

//             var getCurSort = function(){
//               if (!curSort) {
//                 curSort = 'asc';
//               }
//               else if (curSort === 'asc') {
//                 curSort = 'desc';
//               }
//               else if (curSort === 'desc') {
//                 curSort = '';
//               }
//               return curSort;
//             }
//         }],
//         link: function (scope, elem, attrs, ctrl) {
//             if (elem && !elem.hasClass('text-center')) {
//               elem.addClass('text-center');
//             }
//             var table = elem.parent().parent().parent()[0];
//             if (table) {
//               $(table).addClass('sort-table');
//             }
//             scope.getColName = function() {
//               return attrs.tbSort;
//             }
//         }
//     };
// }])
.directive('pageControl2', [function() {
    return {
        restrict: 'EA',
        scope: {
            record: '=',
            evname: '@'
        },
        template: require('../views/module/page-control2.html'),
        controller: ['$window','$rootScope','$scope', '$timeout', function($window, $rootScope, $scope, $timeout){
            var setPages = function (changedPageSize) {
                // 提交后更新操作的当前的页面和分页大小
                //var dataPage = $scope.$parent.dataPage;
                var dataPage = $scope.record;
                if (dataPage && dataPage.totalRecord && dataPage.data) {
                    $scope.pgs = {};
                    // 页面计数从0开始
                    $scope.pgs.currentPg = dataPage.pageNo+1;
                    $scope.pgs.pageSize = $scope.record.pageSize;
                    $scope.pgs.lastPg = dataPage.totalPage;
                    
                }
            };
            $scope.first = function($event) {
                if ($event) $event.preventDefault();
                if($scope.pgs.currentPg === 1) return;
                $scope.pgs.currentPg = 1;
            };
            $scope.prev = function($event) {
                if ($event) $event.preventDefault();
                if($scope.pgs.currentPg === 1) return;
                $scope.pgs.currentPg -=1;
            };
            $scope.next = function($event) {
                if ($event) $event.preventDefault();
                if($scope.pgs.currentPg >= $scope.pgs.lastPg) return;
                $scope.pgs.currentPg +=1;
            };
            $scope.last = function($event) {
                if ($event) $event.preventDefault();
                if($scope.pgs.currentPg === $scope.pgs.lastPg) return;
                $scope.pgs.currentPg = $scope.pgs.lastPg;
            };
            $scope.$watch('pgs.currentPg', function(newValue, oldValue){
              if (newValue) {
                $scope.$emit($scope.evname, newValue, $scope.pgs.pageSize);
              }
            });

            
            //监听模型初始化,完成后计算页面
            $scope.$on('modelInitialized', function(event,param){
                setPages();
            })

        }]
    };
}])
