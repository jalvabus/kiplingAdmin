/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global swal */

let app = angular.module("loginApp", []);

app.controller('loginController', ($scope, $http) => {

    $scope.API = "http://localhost:3002/api/";
    $scope.MAIN = "http://localhost:3002/";
    $scope.usuario = {};

    $scope.login = function () {
        $http({
            method: 'POST',
            url: $scope.MAIN + 'login',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: 'usuario=' + $scope.usuario.usuario + '&password=' + $scope.usuario.password
        }).then((response, err) => {
            console.log(response.data);
            var usuario = response.data;

            if (!usuario) {
                swal({
                    title: "Error!",
                    text: "Usuario o contraseña incorrecto",
                    icon: "error"
                })
            } else {
                swal({
                    title: "Error!",
                    text: "Bienvenido " + usuario.usuario,
                    icon: "success"
                }).then(()=>{
                    location.replace("inicio.html");
                })
                $scope.saveUserLocalStorage(usuario);
                setTimeout(() => {
                    location.replace("pedidos.html");
                }, 2000)
            }
        });
    }
    $scope.usuarios = [];

    $scope.saveUserLocalStorage = function (user) {
        window.localStorage.setItem('user', JSON.stringify(user));
    }

    $scope.eliminar = function (alumno) {
        swal({
            title: "¿Eliminar el alumno " + alumno.nombre + "?",
            text: "Una vez eliminado el alumno se perdera la informacion de el!",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then((willDelete) => {
            if (willDelete) {
                swal("Usuario eliminado con exito", {
                    icon: "success"
                });
            } else {
                swal("Usuario no eliminado!");
            }
        });
    };
});