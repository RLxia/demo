config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$provide'];
function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $provide) {

/*************************路由********************************/
    $stateProvider
    .state("login", {
        name: 'login',
        url: '/login',
        template: require("./views/login.html")
    })
    .state("main", {
        name: 'main',
        url: '/main',
        template: require("./views/main.html")
    })
    .state("main.overview", {   //二级路由
        //name: 'main',
        url: '/Overview',
        views:{
            'contentView':{      //渲染名称  ui-view="contentView"
                template: require("./views/module/overview.html")
            }
        }
        
    })
    .state('main.tables', {   //音乐
        url: '/Tables',
        views: {
            'contentView': {
                template: require('./views/module/table.html')
            }
        }
    })
    .state('main.echarts', {
        url: '/echarts',
        views: {
            'contentView': {
                template: require('./views/module/echarts.html')
            }
        }
    })
    .state('main.g6', {
        url: '/g6',
        views: {
            'contentView': {
                template: require('./views/module/g6.html')
            }
        }
    })

    //默认登录页
    $urlRouterProvider.otherwise("/login");
}

export default config
