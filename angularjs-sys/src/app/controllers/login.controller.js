
/*
 * login controller
 */
LoginController.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UtilsService', 'toastr'];

function LoginController($rootScope, $scope, $stateParams, $state, UtilsService, toastr) {
    $scope.formData = {};
    $scope.login = function () {
        if ($scope.formData.uname && $scope.formData.pwd) {
            //var url= $rootScope.configures.baseUrl;
            let arg = {username: $scope.formData.uname, password: $scope.formData.pwd};
            UtilsService.post($rootScope.configures.baseUrl+"/login", arg).then(function (data) {
                if (data && data.data.status === 10000) {
                    UtilsService.saveCurrentUserToSession(data.data);
                    //$scope.goMain();
                    $state.go('main.overview');   //跳转
                } else {
                    console.log('login error:', data)
                    toastr.warning('登录失败，请检查用户名或密码是否正确！');
                }
            });
        }
    }

    $scope.goMain = function () {
        $state.go('main.overview');
    }
}


angular.module('controller')
    .controller("LoginController", LoginController);



/*angular.module('controller', [])
    .controller("LoginController", ['$rootScope', '$scope', '$stateParams', '$state', 'UtilsService', 'toastr',function($rootScope, $scope, $stateParams, $state, UtilsService, toastr){
        $scope.login = function () {
        if ($scope.formData.uname && $scope.formData.pwd) {
            let arg = {username: $scope.formData.uname, password: $scope.formData.pwd};
            UtilsService.post(UtilsService.getIp()+"/login", arg).then(function (data) {
                if (data && data.data.status === 10000) {
                    UtilsService.saveCurrentUserToSession(data.data);
                    $scope.goMain();
                } else {
                    console.log('login error:', data)
                    toastr.warning('登录失败，请检查用户名或密码是否正确！');
                }
            });
        }
    }

    $scope.goMain = function () {
        $state.go('main.overview');
    }
}]);*/