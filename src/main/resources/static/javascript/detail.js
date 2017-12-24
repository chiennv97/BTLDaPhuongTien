(function(angular) {
    'use strict';
    angular.module('app').component('detail', {
        templateUrl: './components/detail.html',
        bindings: {
            hero: '='
        }
    });
})(window.angular);
