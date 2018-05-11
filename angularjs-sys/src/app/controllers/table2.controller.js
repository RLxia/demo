
Table2Ctrl.$inject = ['$scope','$rootScope','$timeout', '$uibModal', 'UtilsService'];
function Table2Ctrl($scope, $rootScope, $timeout, $uibModal, UtilsService){
  let pageno=0, pagesize=20;
  $scope.getTasks = function (pageno, pagesize, $scope) {
    var args = {pageNo: pageno, pageSize: pagesize} //数据库从0开始
      UtilsService.get(UtilsService.getIp()+"/music", args).then(function(data){
          if (data && data.status === 200) {
              $scope.musicList = data.data;
              $timeout(function(){
                $rootScope.$broadcast('modelInitialized', this);
              },500);
          }
      });
  };
  $scope.getTasks(pageno, pagesize, $scope);
   //监听页数变化
    $scope.$on("reloadPagination", function(scope, pageno, pagesize){
      $scope.getTasks(pageno, pagesize, $scope);
    });

    // $scope.loadForPager = function(pageno, pagesize, $scope) {
    //   MusicService.loadData(pageno, pagesize, $scope);
    // }
    // $scope.loadForPager(pageno, pagesize, $scope);
    // //监听页数变化
    // $scope.$on("reloadPagination", function(scope, pageno, pagesize){
    //   $scope.loadForPager(pageno, pagesize, $scope);
    // });

  }

angular.module('controller').controller('Table2Ctrl', Table2Ctrl);
