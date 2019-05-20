var app = angular.module('perfilApp', [])
    .controller('perfilController', ($scope, $http) => {
        $scope.usuario = {};

        $scope.authLogin = function () {
            if (!localStorage.getItem("user")) {
                window.location.replace('login.html');
            } else {
                $scope.usuario = JSON.parse(window.localStorage.getItem('user'));
                console.log($scope.usuario);
            }
        }

        $scope.authLogin();
    });