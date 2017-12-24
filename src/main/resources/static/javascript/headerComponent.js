(function(angular) {
    'use strict';
    angular.module('app')
        .component('headerComponent', {
            templateUrl: './components/headerComponent.html',
            controller: function($scope) {
                this.setView = function() {
                    this.view = $scope.name
                    this.onViewChange({$event: {view: $scope.name}})
                }
            },
            bindings: {
                view: '<',
                onViewChange: '&'
            }
        });
})(window.angular);