var app = angular.module('usuariosApp', [])
    .controller('usuariosController', ($scope, $http) => {

        $scope.API = "http://localhost:3002/api/";

        $scope.alumno = [];
        $scope.usuario = {};

        $scope.getAll = function () {
            $http({
                method: 'GET',
                url: $scope.API + 'usuario'
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
                url: $scope.API + 'alumno'
            }).then((response, err) => {
                console.log(response);
                $scope.alumnos = response.data;
            })
        }

        $scope.getAllAlumnos();

        $scope.registrarUsuario = function () {

            $http({
                method: 'POST',
                url: $scope.API + 'usuario',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: 'nombre=' + $scope.usuario.nombre +
                    '&apellido_paterno=' + $scope.usuario.apellido_paterno +
                    '&apellido_materno=' + $scope.usuario.apellido_materno +
                    '&email=' + $scope.usuario.email +
                    '&direccion=' + $scope.usuario.direccion +
                    '&telefono=' + $scope.usuario.telefono
            }).then((response, err) => {
                $scope.usuario = {};
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
                url: $scope.API + 'usuario/' + $scope.usuarioSeleccionado._id,
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

        $scope.removerAlumno = function (alumno) {
            $http({
                method: 'DELETE',
                url: $scope.API + 'usuario/removeAlumno/' + $scope.usuarioSeleccionado._id,
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
                            url: $scope.API + 'usuario/' + usuario._id,
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

        $scope.ciclosEscolares = [];
        $scope.getAllCicloEscolar = function () {
            var data = '?action=getAll'
            $http({
                method: 'GET',
                url: $scope.API + 'ciclo_escolar/index.php' + data
            }).then((response, err) => {
                console.log(response);
                $scope.ciclosEscolares = response.data.ciclos_escolares;
            })
        }

        $scope.getAllCicloEscolar();
    })