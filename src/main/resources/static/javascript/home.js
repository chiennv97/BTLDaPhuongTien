(function(angular) {
    'use strict';
    angular.module('app')
        .component('home', {
            templateUrl: './components/home.html',
            controller: function ($scope,listOnline) {
                $scope.listOnline = listOnline;
                var self = this;
                console.log($scope.listOnline.name);
            }
        });
})(window.angular);
