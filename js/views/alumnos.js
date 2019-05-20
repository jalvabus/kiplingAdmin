var app = angular.module('alumnosApp', [])
    .controller('alumnosController', ($scope, $http) => {

        $scope.API = "http://localhost:3002/api/";

        $scope.alumnos = [];
        $scope.alumno = {};

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
                url: $scope.API + 'alumno'
            }).then((response, err) => {
                console.log(response);
                $scope.alumnos = response.data;

                response.data.forEach((alumno, i) => {
                    $scope.alumnos[i].ciclo_escolar.fecha_inicio = moment(alumno.ciclo_escolar.fecha_inicio).format('YYYY-MM-DD');
                    $scope.alumnos[i].ciclo_escolar.fecha_fin = moment(alumno.ciclo_escolar.fecha_fin).format('YYYY-MM-DD');
                })
            })
        }

        $scope.getAll();

        $scope.registrarAlumno = function () {

            $http({
                method: 'POST',
                url: $scope.API + 'alumno',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: 'nombre=' + $scope.alumno.nombre +
                    '&apellido_paterno=' + $scope.alumno.apellido_paterno +
                    '&apellido_materno=' + $scope.alumno.apellido_materno +
                    '&grupo=' + $scope.alumno.salon +
                    '&status=Inscrito' +
                    '&ciclo_escolar=' + $scope.alumno.cicloEscolar
            }).then((response, err) => {
                console.log(response);

                swal({
                    title: "Alumno registrado",
                    text: "Se ah registrado el alumno",
                    icon: "success"
                })

                $scope.alumno = {};
                $scope.getAll();
            })
        }

        $scope.eliminarAlumno = function (alumno) {
            swal({
                title: "¿Eliminar el alumno " + alumno.nombre + "?",
                text: "Una vez eliminado no se podra recuperar!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        $http({
                            method: 'DELETE',
                            url: $scope.API + 'alumno/' + alumno._id,
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).then((response, err) => {
                            console.log(response);
                            swal({
                                title: "Alumno eliminado!",
                                text: "Se elimino el alumno!",
                                icon: "success",
                            });
                            $scope.getAll();
                        })
                    }
                })
        }

        $scope.ciclosEscolares = [];

        $scope.getAllCicloEscolar = function () {
            $http({
                method: 'GET',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                url: $scope.API + 'ciclo_escolar'
            }).then((response, err) => {
                console.log(response);
                $scope.ciclosEscolares = response.data.ciclos_escolares;
                response.data.ciclos_escolares.forEach((ciclo, i) => {
                    $scope.ciclosEscolares[i].fecha_inicio = moment(ciclo.fecha_inicio).format('YYYY-MM-DD');
                    $scope.ciclosEscolares[i].fecha_fin = moment(ciclo.fecha_fin).format('YYYY-MM-DD');
                })
            })
        }

        $scope.getAllCicloEscolar();
    })