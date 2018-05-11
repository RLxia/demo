import angular from 'angular';
import sanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import ngMessage from 'angular-messages';
import ngResource from 'angular-resource';
import 'angular-ui-bootstrap';
import uiBootstrap from 'angular-ui-bootstrap';
import toastr from 'angular-toastr';
import fileUpload from 'ng-file-upload';
import 'lodash';
import 'bootstrap';

import UtilsService from './basic.server';
import './controllers';
//import './services';
import './filter/main.filter';
import './directives';
 
//app js
import config from './config';
import run from './run';


//css
import '../sass/main.scss';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/angular-toastr/dist/angular-toastr.css';


let homeModule = angular.module('starapp',
    [
    uiRouter, uiBootstrap, toastr, sanitize, fileUpload, ngMessage, ngResource,    // dependency feature widget
    'controller','directive','main.filter',
    ]);

//配置
homeModule.factory('UtilsService', UtilsService);
homeModule.config(config);
homeModule.run(run);

angular.element(document).ready(function () {
    angular.bootstrap(document, ['starapp']);
});
