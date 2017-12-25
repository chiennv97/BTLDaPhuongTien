//header
angular.module("header", [])
    .component('header', {
        templateUrl: './components/header.html',
        controller: 'headerController'
    })
    .controller('headerController', function ($scope, user, $location) {
        $scope.user = user;
        $scope.user.name = 'Đăng Nhập';
        $scope.joinShare = function () {
            $location.path('/joinshare');
        }
    });
