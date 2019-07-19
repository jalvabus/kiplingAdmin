var app = angular.module('usuariosApp', [])
    .controller('usuariosController', ($scope, $http) => {

        $scope.alumno = [];
        $scope.usuario = {};
        $scope.usuarioRegistro = {};

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

        $scope.alumnos = [];

        $scope.getAllAlumnos = function () {
            $http({
                method: 'GET',
                url: API + 'alumno'
            }).then((response, err) => {
                console.log(response);
                $scope.alumnos = response.data;
            })
        }

        $scope.getAllAlumnos();

        $scope.registrarUsuario = function () {

            $http({
                method: 'POST',
                url: API + 'usuario',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: 'nombre=' + $scope.usuarioRegistro.nombre +
                    '&apellido_paterno=' + $scope.usuarioRegistro.apellido_paterno +
                    '&apellido_materno=' + $scope.usuarioRegistro.apellido_materno +
                    '&email=' + $scope.usuarioRegistro.email +
                    '&direccion=' + $scope.usuarioRegistro.direccion +
                    '&telefono=' + $scope.usuarioRegistro.telefono
            }).then((response, err) => {
                $scope.usuarioRegistro = {};
                swal({
                    title: "Usuario registrado",
                    text: "Se ah registrado el usuario",
                    icon: "success"
                })
                console.log(response);
                $scope.getAll();
            })
        }

        $scope.usuarioSeleccionado = {};
        $scope.agregarAlumnos = function (usuario) {
            $scope.usuarioSeleccionado = usuario;
        }

        $scope.relacionarAlumno = function () {
            console.log($scope.usuarioSeleccionado);
            $http({
                method: 'POST',
                url: API + 'usuario/' + $scope.usuarioSeleccionado._id,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: 'id_alumno=' + $scope.usuarioRegistro.id_alumno
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

        $scope.removerAlumno = function (alumno) {
            $http({
                method: 'DELETE',
                url: API + 'usuario/removeAlumno/' + $scope.usuarioSeleccionado._id,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: 'id_alumno=' + alumno._id
            }).then((response, err) => {
                console.log(response);

                swal({
                    title: "Alumno eliminado de la relacion",
                    text: "Se ah eliminado el alumno",
                    icon: "success"
                })

                $scope.usuario = {};
                $scope.getAll();
            })
        }

        $scope.eliminarUsuario = function (usuario) {
            swal({
                title: "¿Eliminar el usuario " + usuario.nombre + "?",
                text: "Una vez eliminado no se podra recuperar!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        $http({
                            method: 'DELETE',
                            url: API + 'usuario/' + usuario._id,
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).then((response, err) => {
                            console.log(response);
                            swal({
                                title: "Usuario eliminado!",
                                text: "Se elimino el usuario!",
                                icon: "success",
                            });
                            $scope.getAll();
                        })
                    }
                })
        }
    })