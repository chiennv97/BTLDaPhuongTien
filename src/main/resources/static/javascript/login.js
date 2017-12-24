(function(angular) {
    'use strict';
    angular.module('app')
        .component('login', {
            templateUrl: './components/login.html',
            controller: function($scope) {
                var self = this;
                $scope.setView = function() {
                    var message = {
                        id: 'login',
                        name: $scope.name,
                    };
                    var jsonMessage = JSON.stringify(message);
                    console.log('Senging message: ' + jsonMessage);
                    ws.send(jsonMessage);
                    self.view = $scope.name;
                    self.hide = true;
                    self.onViewChange({$event: {view: $scope.name}});
                    self.onHideChange({$event: {hide: true}});

                }
            },
            bindings: {
                view: '<',
                hide: '<',
                onViewChange: '&',
                onHideChange: '&'
            }
        });
})(window.angular);