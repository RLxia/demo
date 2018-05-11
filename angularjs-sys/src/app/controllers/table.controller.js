
/*
 * login controller
 * 
 */
import taskAddTpl from '../templates/modal-task-add.html';
import taskDelTpl from '../templates/modal-delete.html';

TableCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'UtilsService', 'toastr','$uibModal'];

function TableCtrl($rootScope, $scope, $stateParams, $state, UtilsService, toastr,$uibModal) {
    //获取数据
    $scope.getTasks = function () {
        UtilsService.get(UtilsService.getIp()+"/tasks").then(function (data) {
           if(data && data.status=='200'){
               $scope.tasksData = data.data;
           }
        });  
    };
    $scope.getTasks();

     //添加
    $scope.addTaskModal =function() {
        modalForAdd($scope)    //调用方法传入父作用域
    };
    //编辑
    $scope.updTaskModal = function(row) {
        modalForUpd($scope,row);   //row当前这条数据
    };
    //删除
    $scope.delTaskModal = function(id) {
        modalForDel($scope,id);
    };
    //添加请求
    $scope.addTask = function(text){   //text添加名称
        var args = {text: text}
        UtilsService.post(UtilsService.getIp()+"/task/add", args).then(function (data) {
            if (data && data.status === 200) {
                toastr.success("添加成功！");
                $scope.getTasks();
            } else {
                console.log('login error:', data)
            }
        });
    }
    //添加弹层
    let modalForAdd = function (pscope) {   //pscope 父作用域
        $uibModal.open({
        size: 'md',
        animation: true,
        template: taskAddTpl,
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
            $scope.formData={name:""};
            $scope.ok = function () {
                if ($scope.formData.name) {
                pscope.addTask($scope.formData.name);
                $uibModalInstance.dismiss('cancel');  //隐藏
                } else {
                toastr.error("名称不能为空！")
                }
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel'); //隐藏
            };
        }]
        });
    };
    //编辑请求
    $scope.updTask = function(list) {
        if(list && list.id){
           UtilsService.post(UtilsService.getIp()+"/task/upd", list).then(function (data) {
                if (data && data.status === 200) {
                    toastr.success("编辑成功！");
                    $scope.getTasks();
                } else {
                    console.log('login error:', data)
                }
            });
        }
    };
    //编辑弹层
    let modalForUpd = function (pscope,row) {   //pscope 父作用域
        $uibModal.open({
        size: 'md',
        animation: true,
        template: taskAddTpl,
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
            var list = row;
            $scope.formData={name:list.text}; //编辑中的输入内容
            $scope.ok = function () {
                if ($scope.formData.name) {
                list.text = $scope.formData.name;
                pscope.updTask(list);
                $uibModalInstance.dismiss('cancel');  //隐藏
                } else {
                toastr.error("名称不能为空！")
                }
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel'); //隐藏
            };
        }]
        });
    }
    //删除请求
    $scope.delTask = function(id) {
        if(id){
            var args = {id: id};
           UtilsService.post(UtilsService.getIp()+"/task/del", args).then(function (data) {
                if (data && data.status === 200) {
                    toastr.success("删除成功！");
                    $scope.getTasks();
                } else {
                    console.log('login error:', data)
                }
            });
        }
    };
    //删除弹层
    let modalForDel = function (pscope, id) {
        var modalInstance = $uibModal.open({
            size: 'sm',
            animation: true,
            template: taskDelTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.ok = function () {
                  pscope.delTask(id);
                  $uibModalInstance.dismiss('cancel');
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    }

}


angular.module('controller')
    .controller("TableCtrl", TableCtrl);



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