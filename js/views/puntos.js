var app = angular.module('usuariosApp', [])
    .controller('usuariosController', ($scope, $http) => {

        $scope.alumno = [];
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

        $scope.getAll = function () {
            $http({
                method: 'GET',
                url: API + 'usuario'
            }).then((response, err) => {
                console.log(response);
                $scope.usuarios = response.data;
            })
        }

        $scope.getAll();

        $scope.getPuntosTotales = function () {
            $http({
                method: 'GET',
                url: API + 'puntos'
            }).then((response, err) => {
                console.log(response);
                $scope.puntos = response.data;
            })
        }

        $scope.getPuntosTotales();

        $scope.usuarioSeleccionado = {};
        $scope.seleccionarUsuario = function (usuario) {
            $scope.usuarioSeleccionado = usuario;
        }

        $scope.relacionarAlumno = function () {
            console.log($scope.usuarioSeleccionado);
            $http({
                method: 'POST',
                url: API + 'usuario/' + $scope.usuarioSeleccionado._id,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: 'id_alumno=' + $scope.usuario.id_alumno
            }).then((response, err) => {
                console.log(response);

                swal({
                    title: "Alumno relacionado",
                    text: "Se ah relacionado el alumno",
                    icon: "success"
                })

                $scope.usuario = {};
                $scope.getAll();
            })
        }

        $scope.venta = {};
        $scope.addPuntos = function () {
            if ($scope.venta.puntos) {
                $scope.venta.total = (Number($scope.venta.puntos) * 1.1).toFixed(2);
                $scope.venta.totalPuntos = Number($scope.usuarioSeleccionado.puntos) + Number($scope.venta.puntos);
            } else {
                $scope.venta.total = 0;
                $scope.venta.totalPuntos = $scope.usuarioSeleccionado.puntos;
            }
        }

        $scope.agregarPuntos = function () {
            if ($scope.puntos.totalPuntos < $scope.venta.puntos) {
                swal({
                    title: "Puntos insuficientes",
                    text: "No se cuenta con los puntos suficientes para realizar la accion",
                    icon: "error"
                })
                $scope.venta = {};
            } else {

                $scope.removePuntosTotales()
                    .then((resolve, reject) => {
                        $scope.createHistorialVentaPuntos()
                            .then((resolve, reject) => {
                                $scope.agregarPuntosUsuario();
                            })
                    })
            }
        }

        $scope.agregarPuntosUsuario = function () {
            $http({
                method: 'POST',
                url: API + 'usuario/addPuntos/' + $scope.usuarioSeleccionado._id,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: 'totalPuntos=' + $scope.venta.totalPuntos
            })
                .then((response, err) => {
                    console.log(response.data);
                    swal({
                        title: "Puntos Agregados",
                        text: "Se han agregado los puntos",
                        icon: "success"
                    })
                    $scope.venta = {};
                    $scope.getAll();
                    $scope.getPuntosTotales();
                })
        }

        $scope.removePuntosTotales = function () {
            return new Promise((resolve, reject) => {
                $http({
                    method: 'POST',
                    url: API + 'puntos/removePuntos/' + $scope.puntos._id,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: 'puntos=' + (Number($scope.puntos.totalPuntos) - Number($scope.venta.puntos))
                })
                    .then((response, err) => {
                        console.log(response.data);
                        resolve(true);
                    })
            })
        }

        $scope.createHistorialVentaPuntos = function () {
            return new Promise((resolve, reject) => {
                $http({
                    method: 'POST',
                    url: API + 'venta-puntos',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: 'puntos=' + Number($scope.venta.totalPuntos) + '&usuario=' + $scope.usuarioSeleccionado._id
                })
                    .then((response, err) => {
                        console.log(response.data);
                        resolve(true);
                    })
            })
        }
    })