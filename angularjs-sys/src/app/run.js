run.$inject = ['$rootScope', '$location', '$state', '$window', '$injector', '$templateCache'];
function run($rootScope, $location, $state, $window, $injector, $templateCache) {

    //参数配置
    $rootScope.configures = {
        //baseUrl: '/',
        baseUrl: 'http://localhost:3333',
        pageDefaultSize: parseInt($window.localStorage.page_size) || 10, //默认列表加载条数
        username: $window.sessionStorage.username || '',//登录用户名
        user_id: $window.sessionStorage.user_id  ||'',
        accessToken: $window.sessionStorage.accessToken, //读取token记录
        
    };
    //存路径
    $rootScope.location = $location;   
}

export default run
