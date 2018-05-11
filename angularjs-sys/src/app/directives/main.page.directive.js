import echarts from 'echarts';

angular.module('directive')
    .component('navBarTop', {
        bindings: { //单向绑定
          brand: '<'
        },
        // Pulls in out template
        template: require('../views/components/navbar-top.html'),
        controller: function () {  
            this.menu = [{
            id:"01",
            name: "Home",
            component: "home"
          }, {
            id:"02",
            name: "About",
            component: "about"
          }, {
            id:"03",
            name: "Contact",
            component: "contact"
          }]

        }
  })
//   .directive('navBarTop', function() {
//     return {
//       restrict: 'EA',
//       scope:{
//         brand:'='
//       },
//       template: require('../views/components/navbar-top.html'),
//       controller:['$window','$scope','$state',function($window,$scope,$state){
//         $scope.title = $window.sessionStorage.username;
//          $scope.lists =[{name:'列表A',value:'1'},
//                     {name:'列表B',value:'2'},
//                     {name:'列表C',value:'3'},
//                     {name:'退出',value:'0'}];
//         $scope.changeSelect = function(value) {
//             if(value =='0'){
//               $state.go('login');   //跳转
//             }
//         }
//       }]
      
//     };
// })
  
  .component('sideBar', {
        // defines a two way binding in and out of the component
        bindings: {
          brand: '<'
        },
        // Pulls in out template
        template: require('../views/components/sidebar.html'),
        controller: function () {
          this.menu = [{
            id: "001",
            name: "任务",
            state: "main.overview"
          }, {
            id: "002",
            name: "音乐",
            state: "main.tables"
          }, {
            id: "003",
            name: "图表",
            state: "main.echarts"
          }, {
            id: "004",
            name: "拓扑图",
            state: "main.g6"
          }];
    }
  })
  //音乐分页
  .directive('pageControl', function() {
    return {
      restrict: 'EA',
      scope:{
        record:'='
      },
      template: require('../views/module/page-control.html'),
      controller:['$window','$scope','$state',function($window,$scope,$state){
        $scope.getLists = function() {
          var record = $scope.record;
          console.log(record);
          if(record && record.data){
            $scope.pgs ={
              currentPg:record.pageNo,
              pageSize:record.pageSize,
              lastPg:record.totalPage-1
            };
            //$scope.pgs.currentPg = record.pageNo;   //起始页
            //$scope.pgs.pageSize = record.pageSize;  //每页条数
            //$scope.pgs.lastPg = record.totalPage-1; //总数
          }
        }
        //首页
        $scope.first = function() {
          if($scope.pgs.currentPg == 0) return;
          $scope.pgs.currentPg = 0;
        };
        //上一页
        $scope.prev = function() {
          if($scope.pgs.currentPg == 0) return;
          $scope.pgs.currentPg -= 1;
        };
        //下一页
        $scope.next = function() {
          if($scope.pgs.currentPg >= $scope.pgs.lastPg) return;
          $scope.pgs.currentPg +=1;
        };
        //末页
        $scope.last = function() {
           if($scope.pgs.currentPg == $scope.pgs.lastPg) return;
          $scope.pgs.currentPg =$scope.pgs.lastPg;
        };
        //异步原因导致数据不同步，获取musicList
        $scope.$on('modelInitialized',function(){
          $scope.getLists();
        });
        //监听页数变化
        $scope.$watch('pgs.currentPg',function(newValue,oldValue){  //newValue 当前页数
          console.log(newValue);
          if(newValue!=oldValue ) {
            $scope.$emit('reloadPagination', newValue, $scope.pgs.pageSize);  //触发控制中的请求
          }
          
        })
      }] 
    };
})
//图表
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
                    series: [{  
                        data:$scope.data,
                        type: 'line',
                        areaStyle: {} 
                    }]
                };  
      
                var myChart = echarts.init(document.getElementById($scope.id));  
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