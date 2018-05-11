
/*
 * echarts controller
 */
EChartsController.$inject = ['$scope'];

function EChartsController($scope) {
    $scope.legend = ["组织统计"];  
    $scope.item = ['2013', '2014', '2015', '2016', '2017', '2018'];  //X轴展示数据  
    $scope.data = [5, 10, 10, 20, 30, 40] //数据  
    
    $scope.options2 = {
        legend: ["组织统计"],
        item:['2013', '2014', '2015', '2016', '2017', '2018'],
        data:[5, 10, 10, 20, 30, 40]
    }
}
angular.module('controller')
    .controller("EChartsController", EChartsController);



