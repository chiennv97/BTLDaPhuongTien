(function(angular) {
    'use strict';
    angular.module('app').component('header', {
        templateUrl: './components/header.html',
        bindings: {
            name: '='
        }
    });
})(window.angular);
