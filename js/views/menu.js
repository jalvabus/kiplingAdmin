var app = angular.module('menuApp', [])
    .controller('menuController', ($scope, $http) => {
        $scope.API = "http://localhost:3002/api/";

        $scope.menus = [];
        $scope.startDate = null;
        $scope.endDate = null;
        $scope.dayStartDate = null;
        $scope.dayEndDate = null;

        $scope.cargandoMenus = true;

        $scope.getAll = function () {

        }

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

        $scope.getFechaSemana = function () {

            $scope.add = 0;
            $scope.remove = 0;

            var date = new Date();

            var dayOfWeek = moment(date, 'YYYY-MM-DD').format('dddd');
            console.log(dayOfWeek);

            switch (dayOfWeek) {
                case 'Monday':
                    $scope.add = 4;
                    $scope.remove = 0;
                    break;
                case 'Tuesday':
                    $scope.add = 3;
                    $scope.remove = 1;
                    break;
                case 'Wednesday':
                    $scope.add = 2;
                    $scope.remove = 2;
                    break;
                case 'Thursday':
                    $scope.add = 1;
                    $scope.remove = 3;
                    break;
                case 'Friday':
                    $scope.add = 0;
                    $scope.remove = 4;
                    break;
                case 'Saturday':
                    break;
                case 'Sunday':
                    break;
            }

            $scope.startDate = moment(date).subtract($scope.remove, "days").format('YYYY-MM-DD');
            $scope.endDate = moment(date).add($scope.add, "days").format('YYYY-MM-DD');
            console.log($scope.startDate, $scope.endDate);
        }

        $scope.menusAgrupados = {};
        $scope.getMenuSemana = function () {
            $scope.menusAgrupados = {};
            var data = 'fecha_inicio=' + $scope.startDate + '&fecha_fin=' + $scope.endDate;
            $http({
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                url: $scope.API + 'menu/getByDate',
                data: data
            }).then((response, err) => {
                console.log("obteniendo menus")
                console.log(response.data);
                var data = response.data;

                console.log(data.menus.length);

                $scope.menus = data.menus;

                $scope.menus.forEach((menu, i) => {
                    var date = new Date(menu.fecha);
                    $scope.menus[i].dia = $scope.detDaySpanish(moment(date, 'YYYY-MM-DD').format('dddd'));
                    $scope.menus[i].fecha = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
                })

                var y = 1;
                var x = 0;
                for (var i = 0; i < ((data.menus.length) / 2); i++) {

                    $scope.menusAgrupados[i] = {
                        menu1: $scope.menus[x],
                        menu2: $scope.menus[y]
                    };
                    y += 2;
                    x += 2;
                }
                console.log("obteniendo menus agrupados")
                console.log($scope.menusAgrupados);
            })
        }

        $scope.detDaySpanish = function (day) {
            switch (day) {
                case 'Monday':
                    return 'Lunes';
                    break;
                case 'Tuesday':
                    return 'Martes';
                    break;
                case 'Wednesday':
                    return 'Miercoles';
                    break;
                case 'Thursday':
                    return 'Jueves';
                    break;
                case 'Friday':
                    return 'Viernes';
                    break;
                case 'Saturday':
                    return 'Sabado';
                    break;
                case 'Sunday':
                    return 'Domingo';
                    break;
            }
        }

        $scope.getFechaSemana();
        $scope.getMenuSemana();

        $scope.menu = {};
        $scope.menu2 = {};
        $scope.registrarMenu = function () {
            var fecha = moment($scope.menu.fecha).add(1, 'days').format('YYYY-MM-DD');

            new Promise((resolve, reject) => {
                $http({
                    method: 'POST',
                    url: $scope.API + 'menu',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: 'fecha=' + fecha +
                        '&comida=' + $scope.menu.comida +
                        '&agua=' + $scope.menu.agua +
                        '&postre=' + $scope.menu.postre +
                        '&precio=' + $scope.menu.precio
                }).then((response, err) => {
                    console.log(response.data);
                    resolve(true);
                })
            }).then((response) => {

                if (response) {

                    $http({
                        method: 'POST',
                        url: $scope.API + 'menu',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        data: 'fecha=' + fecha +
                            '&comida=' + $scope.menu2.comida +
                            '&agua=' + $scope.menu2.agua +
                            '&postre=' + $scope.menu2.postre +
                            '&precio=' + $scope.menu2.precio
                    }).then((response, err) => {
                        console.log(response.data);

                        swal({
                            title: "Menus Registrado!",
                            text: "Se han registrado los menu del dia!",
                            icon: "success",
                        });
                        $scope.menu = {};
                        $scope.menu2 = {};
                        $scope.getMenuSemana();
                    })

                } else {
                    swal({
                        title: "Ah ocurrido un error!",
                        text: "No se han registrado los menu del dia!",
                        icon: "error",
                    });

                }
            })

        }

        $scope.eliminarMenus = function (menus) {
            swal({
                title: "¿Eliminar los menus del dia " + menus.menu1.dia + "?",
                text: "Una vez eliminado no se podra recuperar!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        new Promise((resolve, reject) => {
                            $http({
                                method: 'DELETE',
                                url: $scope.API + 'menu/' + menus.menu1._id,
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            }).then((response, err) => {
                                console.log(response);
                                resolve(true);
                            })
                        }).then(() => {
                            $http({
                                method: 'DELETE',
                                url: $scope.API + 'menu/' + menus.menu2._id,
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            }).then((response, err) => {
                                console.log(response);
                                swal({
                                    title: "Menus eliminados!",
                                    text: "Se eliminaron los menus de la semana!",
                                    icon: "success",
                                });
                                $scope.getFechaSemana();
                                $scope.getMenuSemana();
                            })
                        })
                    }
                })
        }
    })