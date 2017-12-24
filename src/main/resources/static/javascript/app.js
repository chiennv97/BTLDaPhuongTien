var ws = new WebSocket('wss://' + location.host + '/groupcall');
var participants = {};
var name;
var room;
var joinUser;
var joinRoom;
var video;
//new var
var listOnline = 0;
//new var
var listRoom = 0;
//new var
var hostOfRoom;
window.onbeforeunload = function() {
    console.log("close ws");
    ws.close();
};
// function sendMessage(message) {
//     var jsonMessage = JSON.stringify(message);
//     console.log('Senging message: ' + jsonMessage);
//     ws.send(jsonMessage);
// }
(function(angular) {
    'use strict';
    angular.module('app', ['ngComponentRouter', 'heroes', 'crisis-center', "share-screen"])

        .config(function($locationProvider) {
            $locationProvider.html5Mode(true);
        })

        .value('$routerRootComponent', 'app')
        .factory("listOnline",function(){
            return {};
        })

        .component('app', {
            templateUrl: './components/app.html',
            // '<nav>\n' +
            // '  <a ng-link="[\'CrisisCenter\']">Crisis Center</a>\n' +
            // '  <a ng-link="[\'Heroes\']">{{ $ctrl.view }}</a>\n' +
            // '</nav>\n' +
            // '<ng-outlet></ng-outlet>\n',
            bindings: {
                view : '<',
                hide: '<'
            },
            $routeConfig: [
                {path: '/crisis-center/...', name: 'CrisisCenter', component: 'crisisCenter'},
                {path: '/heroes/...', name: 'Heroes', component: 'heroes' },
                {path: '/shareScreen/...', name: 'ShareScreen', component: 'shareScreen' },
                {path: '/home', name: 'Home', component: 'home' }
            ]
        })
        .controller('MainCtrl', function MainCtrl($scope,listOnline) {
            $scope.listOnline = listOnline;
            $scope.listOnline.name = "abc";
            this.view = 'Đăng Nhập';
            this.hide = false;
            var self = this;
            ws.onmessage = function(message) {
                var parsedMessage = JSON.parse(message.data);
                console.info('Received message: ' + message.data);
                switch (parsedMessage.id) {
                    case 'getListOnline':
                        break;
                    default:
                        console.log("default");
                        console.error('Unrecognized message', parsedMessage);
                }
            };
            // $scope.debug = function () {
            //     // self.name = "chien";
            //     self.hide = false;
            // };
        });
})(window.angular);