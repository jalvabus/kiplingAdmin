var app = angular.module('cicloEscolarApp', [])
    .controller('cocloEscolarController', ($scope, $http) => {

        $scope.ciclosEscolares = [];
        $scope.cicloEscolarRegistro = {};

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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                url: API + 'ciclo_escolar'
            }).then((response, err) => {
                console.log(response);
                $scope.ciclosEscolares = response.data.ciclos_escolares;
                response.data.ciclos_escolares.forEach((ciclo, i) => {
                    $scope.ciclosEscolares[i].fecha_inicio = moment(ciclo.fecha_inicio).format('YYYY-MM-DD');
                    $scope.ciclosEscolares[i].fecha_fin = moment(ciclo.fecha_fin).format('YYYY-MM-DD');
                })
            })
        }

        $scope.cicloEscolar = {};
        $scope.getCicloEscolarActual = function () {
            $http({
                method: 'GET',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                url: API + 'ciclo_escolar_actual'
            }).then((response, err) => {
                console.log(response);
                $scope.cicloEscolar = response.data;
                $scope.cicloEscolar.fecha_inicio = moment(response.data.ciclo_escolar.fecha_inicio).format('YYYY-MM-DD');
                $scope.cicloEscolar.fecha_fin = moment(response.data.ciclo_escolar.fecha_fin).format('YYYY-MM-DD');
            })
        }
        $scope.getAll();
        $scope.getCicloEscolarActual();

        $scope.actualizarCicloEscolar = function () {
            console.log($scope.cicloEscolarActual);

            if (!$scope.cicloEscolar) {
                console.log($scope.cicloEscolar);
                console.log("No hay")
                $http({
                    method: 'PUT',
                    url: API + 'ciclo_escolar_actual',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: 'action=updateOne' +
                        '&id_ciclo_escolar=' + $scope.cicloEscolarActual +
                        '&id_ciclo_escolar_actual=0'
                }).then((response, err) => {
                    console.log(response);

                    swal({
                        title: "Ciclo escolar actualizado",
                        text: "Se ah actualizado el ciclo escolar",
                        icon: "success"
                    })
                    $scope.getCicloEscolarActual();
                })
            } else {
                console.log("Si hay")
                console.log($scope.cicloEscolar);
                $http({
                    method: 'PUT',
                    url: API + 'ciclo_escolar_actual',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: 'action=updateOne' +
                        '&id_ciclo_escolar=' + $scope.cicloEscolarActual +
                        '&id_ciclo_escolar_actual=' + $scope.cicloEscolar._id
                }).then((response, err) => {
                    console.log(response);

                    swal({
                        title: "Ciclo escolar actualizado",
                        text: "Se ah actualizado el ciclo escolar",
                        icon: "success"
                    })
                    $scope.getCicloEscolarActual();
                })
            }
        }

        $scope.registrarCiclo = function () {
            var temporal = {};

            temporal.inicio = moment($scope.cicloEscolarRegistro.inicio).add(1, 'days').format('YYYY-MM-DD');
            temporal.fin = moment($scope.cicloEscolarRegistro.fin).add(1, 'days').format('YYYY-MM-DD');
            console.log(temporal);

            console.log($scope.cicloEscolarActual);
            $http({
                method: 'POST',
                url: API + 'ciclo_escolar',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: 'fecha_inicio=' + temporal.inicio +
                    '&fecha_fin=' + temporal.fin
            }).then((response, err) => {
                console.log(response);

                swal({
                    title: "Ciclo escolar registrado",
                    text: "Se ah registrado el ciclo escolar",
                    icon: "success"
                })

                $scope.getAll();
            })
        }

        $scope.eliminarCicloEscolar = function (ciclo_escolar) {
            swal({
                title: "¿Eliminar el ciclo escolar " + ciclo_escolar.fecha_inicio + " - " + ciclo_escolar.fecha_fin + "?",
                text: "Una vez eliminado no se podra recuperar!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    $http({
                        method: 'DELETE',
                        url: API + 'ciclo_escolar/' + ciclo_escolar._id,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        data: 'action=deleteOne' +
                            '&id_ciclo_escolar=' + ciclo_escolar._id
                    }).then((response, err) => {
                        console.log(response);
                        swal({
                            title: "Ciclo escolar eliminado!",
                            text: "Se elimino el ciclo escolar!",
                            icon: "success",
                        });
                        $scope.getAll();
                    })
                }
            })
        }
    })