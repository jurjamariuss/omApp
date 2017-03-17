var omApp = angular.module('omApp',[]);

omApp.config(function($routeProvider) {
    // $routeProvider
    //     .when('/', { templateUrl: 'Pages/home.html', controller: 'homeController' })
    //     .when('/view1', { templateUrl: 'Pages/view1.html', controller: 'view1Controller' })
    //     .when('/view2', { templateUrl: 'Pages/view2.html', controller: 'view2Controller' })
});


omApp.controller('mainController', function($scope,$document,$timeout) {
    
    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') }); // initializare scanner
    
    var rTeam = [   { text: 'Intebare nr.1 ?', id: 1, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }},
                    { text: 'Intebare nr.2 ?', id: 2, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }},
                    { text: 'Intebare nr.3 ?', id: 3, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }},
                    { text: 'Intebare nr.4 ?', id: 4, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }},
                    { text: 'Intebare nr.5 ?', id: 5, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }}
                ];
    
    var bTeam = [   { text: 'Intebare nr.1 ?', id: 1, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }},
                    { text: 'Intebare nr.2 ?', id: 2, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }},
                    { text: 'Intebare nr.3 ?', id: 3, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }},
                    { text: 'Intebare nr.4 ?', id: 4, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }},
                    { text: 'Intebare nr.5 ?', id: 5, ans : { a : "ras 1", b : "ras 2", c : "ras 3" }}
                ];
                
    var socket = io.connect();
    
    $scope.team         = "";   //(rosu sau albastru)
    $scope.scanContent  = "";   //(qr scanat)
    $scope.quesArr      = "";   //(array cu intebari si raspunsuri)
    $scope.ques         = "";   //(intrebarea si rasp. curente)
    $scope.answ         = "";   //(raspunsul aferent scanului)
    var quesNr          = 0;    //index intrebare si raspunsuri
    $scope.showCamera = false;
    $scope.infoMess = "";
    $scope.blueTeamPro = { que :"", ans:""};
    $scope.redTeamPro = { que :"", ans:""};

    
    //LOGICA SELECTARE ECHIPA
    $scope.handleSelection = function () {
      if ($scope.team == "rosu") {
          $scope.quesArr = rTeam;
          $scope.ques = $scope.quesArr[quesNr];
          $scope.showCamera = true;
          startCamera();
      } else if ($scope.team == "albastru") {
          $scope.quesArr = bTeam;
          $scope.ques = $scope.quesArr[quesNr];
          $scope.showCamera = true;
          startCamera();
      }
      socket.emit('teamSelected', $scope.team)
    };
    
    
    
    
    //SCAN EVENT
    scanner.addListener('scan', function (content) {
          
       $scope.scanContent = JSON.parse(content);
       if ($scope.scanContent.team == $scope.team) {
           
           if ($scope.scanContent.que == $scope.ques.id) {
               
              $scope.showCamera = false;
              $scope.answ = $scope.ques.ans[$scope.scanContent.ans];
              socket.emit('show answer', $scope.team,$scope.ques.text,$scope.answ);
              $timeout($scope.nextAction,5000);
               if ($scope.scanContent.cor) {
                   $scope.infoMess = "Raspuns Corect!!!";
               } else {
                   $scope.infoMess = "Raspuns Incorect!!!";
               }
              
           } else {
               $scope.infoMess = "Raspunsul este de la alta intrebare !!!"
               $timeout(function(){$scope.infoMess = ""},2000);
           }
       } else {
           $scope.infoMess = "Raspunsul este de la alta echipa !!!"
            $timeout(function(){$scope.infoMess = ""},2000);
       }
       $scope.$apply();
      });
      
      
      $scope.nextAction = function () {
          if ($scope.infoMess == "Raspuns Corect!!!") {
              quesNr ++;
              $scope.ques = $scope.quesArr[quesNr];
              $scope.answ = "";
              $scope.scanContent = "";
              $scope.showCamera = true;
              $scope.infoMess = "";
          } else { 
             $scope.ques = $scope.quesArr[quesNr];
             $scope.answ = "";
             $scope.scanContent = "";
             $scope.showCamera = true;
             $scope.infoMess = "";
          }
      }
      
      let startCamera = function () {
          Instascan.Camera.getCameras().then(function (cameras) {
          scanner.start(cameras[0]);
        })
      };
      
      socket.on('proiector',function(team,que,ans){
          if (team == "rosu") { 
              $scope.redTeamPro.que = que;
              $scope.redTeamPro.ans = ans;
          } else {
              $scope.blueTeamPro.que = que;
              $scope.blueTeamPro.ans = ans;
          }
          $scope.$apply();
        })
      
});






