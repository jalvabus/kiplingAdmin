var app = angular.module('pedidosApp', [])
    .controller('pedidosController', ($scope, $http) => {
        $scope.pedidos = [];

        $scope.startDate = null;
        $scope.endDate = null;

        $scope.usuario = {};

        $scope.authLogin = function () {
            if (!localStorage.getItem("user")) {
                window.location.replace('login.html');
            } else {
                $scope.usuario = JSON.parse(window.localStorage.getItem('user'));
                $scope.usuario.telefono = Number(JSON.parse(window.localStorage.getItem('user')).telefono);
                console.log($scope.usuario);
            }
        }

        $scope.authLogin();

        $scope.getPedidosSemana = function () {

            $scope.add = 0;
            $scope.remove = 0;

            var date = new Date('2019-04-10');

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

            console.log($scope.startDate);
            console.log($scope.endDate);

            var data = '?action=getByWeek&fecha_inicio=' + $scope.startDate + '&fecha_fin=' + $scope.endDate;
            $http({
                method: 'GET',
                url: API + 'pedido' + data
            }).then((response, err) => {
                console.log(response.data);
                var data = response.data;
                $scope.pedidos = data;

                var y = 0;
                response.data.forEach((pedido, i) => {
                    if (!pedido.entregado) {
                        $scope.pedidos[y].fecha = moment(pedido.fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');

                        pedido.detalles.forEach((detalles, x) => {
                            $scope.pedidos[y].detalles[x].menu.dia = $scope.detDaySpanish(moment(detalles.menu.fecha).format('dddd'));
                        })

                        x++;
                    }
                })
            })

        }

        $scope.getPedidosPendientes = function () {

        }

        $scope.getPedidosSemana();

        $scope.getAll = function () {
            $http({
                method: 'GET',
                url: API + 'pedido'
            }).then((response, err) => {
                console.log(response.data);
                $scope.pedidos = response.data;

                response.data.forEach((pedido, i) => {
                    $scope.pedidos[i].fecha = moment(pedido.fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');

                    pedido.detalles.forEach((detalles, x) => {
                        $scope.pedidos[i].detalles[x].menu.dia = $scope.detDaySpanish(moment(detalles.menu.fecha).format('dddd'));
                    })
                })
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

        $scope.getAll();

        $scope.pedido = {};
        $scope.selectPedido = function (pedido) {
            $scope.pedido = pedido;
        }

        $scope.pagarPedido = function (pedido) {
            console.log(pedido);

            var data = 'id=' + pedido._id;
            $http({
                method: 'POST',
                url: API + 'pedido/pagarPedido',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: data
            }).then((response, err) => {
                console.log(response.data);
                var data = response.data;

                swal({
                    title: "Pedido Pagado!",
                    text: data.mensaje,
                    icon: "success",
                });

                $scope.getAll();
            })
        }

        $scope.entregarPedido = function (pedido, detalles) {
            console.log(pedido);
            console.log(detalles);

            var data = 'idPedido=' + pedido._id + '&idDetalle=' + detalles._id;
            $http({
                method: 'POST',
                url: API + 'pedido/entregarPedido',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: data
            }).then((response, err) => {
                console.log(response.data);
                var data = response.data;

                swal({
                    title: "Pedido Pagado!",
                    text: data.mensaje,
                    icon: "success",
                });
                $scope.getAll();
            })
        }
    })