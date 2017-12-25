var ws = new WebSocket('wss://' + location.host + '/groupcall');
window.onbeforeunload = function () {
    console.log("close ws");
    ws.close();
};

var app = angular.module("main", ["ngRoute", "login", "header"]);
app.factory("user", function () {
    return {};
});
app.service('mainService', function ($rootScope) {
    var room;
    var joinUser;
    var joinRoom;
    var participants = {};
    var video;
    var name;
    //new var
    var listOnline;
    //new var
    var listRoom = 0;
    //new var
    var hostOfRoom;
    var self = this;
    ws.onmessage = function (message) {
        var parsedMessage = JSON.parse(message.data);
        console.info('Received message: ' + message.data);
        switch (parsedMessage.id) {
            case 'login':
                console.log("chane");
                name = parsedMessage.name;
                break;
            case 'sendOverview':
                self.sendOverview();
                break;
            case 'receiveVideoAnswer':
                console.log("receiveVideoAnswer");
                self.receiveVideoResponse(parsedMessage);
                break;
            case 'iceCandidate':
                console.log("iceCandidate");
                participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
                    if (error) {
                        console.error("Error adding candidate: " + error);
                        return;
                    }
                });
                break;
            case 'getListOnline':
                console.log("change");
                listOnline = parsedMessage.listOnline;
                $rootScope.$broadcast('updateListOnline', {message: "update"});
                break;
            case 'viewShare':
                parsedMessage.data.forEach(self.receiveVideo);
                break;
            case 'getHostOfRoom':
                hostOfRoom = parsedMessage.hostOfRoom;
                // console.log("host of room");
                // console.log(hostOfRoom);
                // document.getElementById('boss').innerText = "Boss's Room: " + hostOfRoom; // ten boss room
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
    this.sendOverview = function () {
        var constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'screen'
                }
            }
        };
        // console.log(name + " registered in room " + room);
        var participant = new View(name, 'overview');
        participants[name] = participant;
        video = participant.getVideoElement();

        var options = {
            localVideo: video,
            mediaConstraints: constraints,
            onicecandidate: participant.onIceCandidate.bind(participant)
        };
        participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
            function (error) {
                if (error) {
                    return console.error(error);
                }
                this.generateOffer(participant.offerToReceiveVideo.bind(participant));
            });
    };
    this.receiveVideoResponse = function (result) {
        participants[result.name].rtcPeer.processAnswer(result.sdpAnswer, function (error) {
            if (error) return console.error(error);
        });
    };
    this.receiveVideo = function (sender) {
        var participant = new View(sender, 'overview');
        participants[sender] = participant;
        var video = participant.getVideoElement();

        var options = {
            remoteVideo: video,
            onicecandidate: participant.onIceCandidate.bind(participant)
        }

        participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
            function (error) {
                if (error) {
                    return console.error(error);
                }
                this.generateOffer(participant.offerToReceiveVideo.bind(participant));
            });
    }
});
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./components/login.html",
            controller: 'loginController'
        })
        .when("/home", {
            templateUrl: "./components/home.html",
            controller: 'homeController'
        })
        .when("/joinshare", {
            templateUrl: "./components/joinshare.html",
            controller: 'joinshareController'
        })
        .when("/viewshare", {
            templateUrl: "./components/viewshare.html",
            controller: 'viewshareController'
        })
        .otherwise({
            redirectTo: "/"
        });
});

//home
app.controller("homeController", function ($scope, user, mainService) {
    $scope.user = user;
    $scope.mainService = mainService;
    $scope.listOnline = mainService.getListOnline();
    $scope.$on('updateListOnline', function (event, args) {
        $scope.listOnline = mainService.getListOnline();
        $scope.$digest()
    });
});

//joinshare
app.controller('joinshareController', function ($scope, user, mainService, $location) {
    $scope.user = user;
    $scope.registerShare = function () {
        var message = {
            id: 'joinShareRoom',
            name: $scope.user.name,
            room: $scope.roomShare
        };
        mainService.sendMessage(message);
        $location.path('/viewshare');
    };
    $scope.viewShare = function () {
        var message = {
            id: 'viewShareRoom',
            name: $scope.user.name,
            room: $scope.roomShare
        };
        mainService.sendMessage(message);
        $location.path('/viewshare');
    }
});

app.controller('viewshareController', function ($scope, user, mainService) {
    $scope.user = user;

});

function sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Senging message: ' + jsonMessage);
    ws.send(jsonMessage);
}