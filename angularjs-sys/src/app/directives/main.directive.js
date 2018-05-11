import echarts from 'echarts';


angular.module('directive')

    .directive('hasPermission', ['$rootScope', 'permissions', function ($rootScope, permissions) {
        return {
            link: function (scope, element, attrs) {
                if (!_.isString(attrs.hasPermission))
                    throw "hasPermission value must be a string";

                var value = attrs.hasPermission.trim();
                var notPermissionFlag = value === "";
                // if (notPermissionFlag) {
                //     value = value.slice(1).trim();
                // }
                function toggleVisibilityBasedOnPermission() {
                    if (!IsDebug) {
                        $rootScope.curentuser.then(function (cu) {
                            var hasPermission = permissions.hasPermission(cu, value || '');

                            if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                                // element[0].style.display = '';
                            } else {
                                element[0].remove();
                            }
                        })
                    }

                }

                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    }])
    
    /**素材列表-截止时间*/
    .directive('stopTimeDirective', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                scope.html = "";
                let stopTime = new Date(attrs.stoptime);
                let nowTime = new Date();
                let diff = stopTime.getTime() - nowTime.getTime();//时间差的毫秒数
                let days = Math.floor(diff / (24 * 3600 * 1000));
                // //计算出小时数
                // let leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                // let hours = Math.floor(leave1 / (3600 * 1000));
                /*24小时后即将过期或过期的素材栏高亮显示*/
                if (days <= 0) {
                    scope.html = "<span style='color:orange'>" + attrs.stoptime + "</span>"
                }
                else {
                    scope.html = "<span>" + attrs.stoptime + "</span>"
                }
                let el = $compile(scope.html)(scope);
                element.append(el);
            }
        };
    }])

    .directive('ngHolder', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                attrs.$set('data-src', attrs.ngHolder);
                var holder = require('holderjs');
                holder.run({images:element[0], nocss:true});
            }
        };
    }])
    //移入显示弹层
    .directive('popoverHoverable', function ($timeout, $document) {
        return {
            restrict: 'A',
            scope: {
                popoverHoverable: '=',
                popoverIsOpen: '='
            },
            link: function(scope, element, attrs) {
                scope.insidePopover = false;

                scope.$watch('insidePopover', function (insidePopover) {
                    togglePopover(insidePopover);
                });
              
                scope.$watch('popoverIsOpen', function (popoverIsOpen) {
                  scope.insidePopover = popoverIsOpen;
                });

                function togglePopover (isInsidePopover) {
                    $timeout.cancel(togglePopover.$timer);
                    togglePopover.$timer = $timeout(function () {
                        if (isInsidePopover) {
                            showPopover();
                        } else {
                            hidePopover();
                        }
                    }, 100);
                }

                function showPopover () {
                    if (scope.popoverIsOpen) {
                        return;
                    }
                    if (!insidePopover(scope.target)) {
                        $(element[0]).click();
                    }
                }

                function hidePopover () {
                    scope.popoverIsOpen = false;
                    scope.insidePopover = false;
                }

                $(document).bind('mouseover', function (e) {
                    var target = e.target;
                    if (inside(target)) {
                        scope.insidePopover = true;
                        scope.target = e.target
                        scope.$digest();
                    }
                });

                $(document).bind('mouseout', function (e) {
                    var target = e.target;
                    if (inside(target)) {
                        scope.insidePopover = false;
                        scope.$digest();
                    }
                });

                scope.$on('$destroy', function () {
                    $(document).unbind('mouseenter');
                    $(document).unbind('mouseout');
                });

                function inside (target) {
                    return insideTrigger(target) || insidePopover(target);
                }

                function insideTrigger (target) {
                    return element[0].contains(target);
                }

                function insidePopover (target) {
                    var isIn = false;
                    var popovers = $('.popover-inner');
                    for (var i = 0, len = popovers.length; i < len; i++) {
                        if (popovers[i].contains(target)) {
                            isIn = true;
                            break;
                        }
                    }
                    return isIn;
                }
            }
        };
    })

    .directive('barY', function() {  
        return {  
            scope: {  
                id: "@",  
                legend: "=",  
                item: "=",  
                data: "="  
            },  
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment  
            template: '<div ></div>',  
            replace: true,  
            link: function($scope, iElm, iAttrs, controller) {  
                var option = {  
                    tooltip: {  
                        show: true,  
                        trigger: "axis"  
                    },  
                    legend: {data:$scope.legend},  
                    yAxis: [{  
                        type: 'value'  
                    }],  
                    xAxis: [{  
                        type: 'category',  
                        boundaryGap:false,
                        data: $scope.item  
                    }],  
                    series: function() {  
                        var serie = [];  
                        for (var i = 0; i < $scope.legend.length; i++) {  
                            var item = {  
                                name: $scope.legend[i],  
                                type: 'line',  
                                areaStyle:{},
                                data: $scope.data[i]  
                            };  
                            serie.push(item);  
                        }  
                        return serie;  
                    }()  
                };  
      
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');  
                myChart.setOption(option);  
            }  
        };  
    }) 

    .directive('eCharts', function() {  
        return {  
            scope: {  
                id: "@",   
                data: "="  
            },  
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment  
            template: '<div ></div>',  
            replace: true,  
            link: function($scope, iElm, iAttrs, controller) {  
                var option = {  
                    tooltip: {  
                        show: true,  
                        trigger: "axis"  
                    },  
                    //legend: {data:$scope.data.legend},  
                    yAxis: [{  
                        type: 'value'  
                    }],  
                    xAxis: [{  
                        type: 'category',  
                        data: $scope.data.item  
                    }],  
                    series: [{  
                        data:$scope.data.data,
                        type:'bar'  
                    }]  
                };  
      
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');  
                myChart.setOption(option);  
            }  
        };  
    }); 