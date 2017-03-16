var omApp = angular.module('omApp',[]);

omApp.config(function($routeProvider) {
    // $routeProvider
    //     .when('/', { templateUrl: 'Pages/home.html', controller: 'homeController' })
    //     .when('/view1', { templateUrl: 'Pages/view1.html', controller: 'view1Controller' })
    //     .when('/view2', { templateUrl: 'Pages/view2.html', controller: 'view2Controller' })
});


omApp.controller('mainController', function($scope,$document) {
    var socket = io.connect();
    $scope.team = "";
    $scope.scanContent = "";
    
    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
      scanner.addListener('scan', function (content) {
          
       $scope.scanContent = content;
       socket.emit('qrScan');
       $scope.$apply();
      });
      
      
      let startCamera = function () {
          Instascan.Camera.getCameras().then(function (cameras) {
          scanner.start(cameras[0]);
        })
      };
     
      
      $scope.handleSelection = function () {
          if ($scope.team != 'proiector') {
              startCamera();
          }
          socket.emit('teamSelected', $scope.team)
      };
      
      socket.on('someTeam',function(param){
          console.log(param +'team event');
      })
});






