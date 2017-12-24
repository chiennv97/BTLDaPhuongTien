
var app = angular.module("main", ["ngRoute"]);
app.factory("user",function(){
    return {};
});
app.service('mainService', function ($rootScope) {
    var ws = new WebSocket('wss://' + location.host + '/groupcall');
    var participants = {};
    var name;
    var room;
    var joinUser;
    var joinRoom;
    var video;
//new var
    var listOnline;
//new var
    var listRoom = 0;
//new var
    var hostOfRoom;
    window.onbeforeunload = function() {
        console.log("close ws");
        ws.close();
    };

    ws.onmessage = function(message) {
        var parsedMessage = JSON.parse(message.data);
        console.info('Received message: ' + message.data);
        switch (parsedMessage.id) {
            case 'login':
                console.log("chane");
                break;
            case 'getListOnline':
                console.log("change");
                listOnline = parsedMessage.listOnline;
                $rootScope.$broadcast('updateListOnline', { message: "update" });
                break;
            default:
                console.log("default");
                console.error('Unrecognized message', parsedMessage);
        }
    };
    this.sendMessage = function (message) {
            var jsonMessage = JSON.stringify(message);
            console.log('Senging message: ' + jsonMessage);
            ws.send(jsonMessage);
    };
    this.getListOnline = function () {
            return listOnline;
    };
});
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "./components/login.html",
            controller: 'loginController'
        })
        .when("/home", {
            templateUrl : "./components/home.html",
            controller: 'homeController'
        })
        .when("/joinshare", {
            templateUrl : "./components/joinshare.html",
            controller: 'joinshareController'
        })
        .otherwise({
            redirectTo: "/"
        });
});
//header
app.component('header',{
    templateUrl: './components/header.html',
    controller: 'headerController'
});
app.controller('headerController',function ($scope,user, $location) {
    $scope.user = user;
    $scope.user.name = 'Đăng Nhập';

});

//login
app.controller("loginController", function ($scope,user, $location, mainService) {
    $scope.user = user;
    $scope.login = function () {
        $scope.user.name = $scope.name;
        // console.log($scope.name);
        var message = {
            id: 'login',
            name: $scope.name,
        };
        mainService.sendMessage(message);
        mainService.sendMessage({
            id : 'getListOnline',
            requester: $scope.name
        });

        $location.path('/home');
    }
});

//home
app.controller("homeController", function ($scope,user, mainService) {
    $scope.user = user;
    $scope.mainService = mainService;
    $scope.listOnline = mainService.getListOnline();
    $scope.$on('updateListOnline', function(event, args){
        $scope.listOnline = mainService.getListOnline();
        $scope.$digest()
    });
});

//joinshare
app.controller('joinshare', function ($scope,user) {

});
