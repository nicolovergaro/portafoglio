
angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $rootScope, $http, $ionicPopup,$ionicModal, $state, $ionicHistory, sharedProperties, utils) {
  $scope.loginData={};
  $scope.loginData.remember=true;
  $scope.imgProfilo = "img/imgdefault.png";

  //funzione per il login
  $scope.doLogin = function(){
    //ottiene l'id dell'utente dato username e password
    utils.getIdByUserAndPsw(
      $scope.loginData.username,
      utils.MD5($scope.loginData.password)
    ).success(function(data){
      var id = data.id_utente;

      if(id == -1){
        $ionicPopup.alert({
          title: 'Errore',
          template: 'Username o password errati'
        }).then(function(res) {
          $scope.loginData.username = $scope.loginData.password = "";
        });
      } else {
        //Salvo l'id nelle sharedProperties
        sharedProperties.setIdUtente(id);
        sharedProperties.setNome(data.nome);
        sharedProperties.setCognome(data.cognome);
        sharedProperties.setSaldo(data.saldo);

        $rootScope.key = utils.MD5($scope.loginData.password) + id

        if($scope.loginData.remember){
          localStorage.setItem("username", $scope.loginData.username);
          localStorage.setItem("password", $scope.loginData.password);
        }

        $state.go('app.profilo', {}, {reload: true});

      }
    });
  }

  if((localStorage.getItem("username") != undefined) && (localStorage.getItem("password") != undefined)){
    $scope.loginData.username = localStorage.getItem("username");
    $scope.loginData.password = localStorage.getItem("password");
    $scope.doLogin();
  }



  $scope.showModal = function() {
    $ionicModal.fromTemplateUrl('templates/registrazione.html', {
      scope: $scope
    }).then(function(modal) {

      $scope.modalView = modal;
      $scope.imgProfilo = "img/imgdefault.png";

      $scope.modalView.show();
    });
  };

  $scope.closeModal = function() {
    $scope.modalView.hide();

  };



  //RegistrazioneCtrl

  $scope.data={};
  $scope.bad = false;
  var called = false;

  $scope.checkUsername = function(){
    utils.checkUsername($scope.data.username).success(function(data){
      $scope.data.bad = !(data.number==0);
    });
  }

  $scope.registra = function(){
    if(!called)
      called = true;
    else
      return;

    if($scope.data.password != $scope.data.password1){
      var alertPopup = $ionicPopup.alert({
        title: 'Errore',
        template: 'Le password non corrispondono'
      });

      return;
    }

    if($scope.data.username == "" || $scope.data.password == "" ||
    $scope.data.nome == "" || $scope.data.cognome == "" ||
    $scope.data.saldo == "" || $scope.data.email == ""){

      var alertPopup = $ionicPopup.alert({
        title: 'Errore',
        template: 'Compilare tutti i campi'
      });

      return;
    }

    utils.addNewUser(
      $scope.data.username,
      utils.MD5($scope.data.password),
      $scope.data.nome,
      $scope.data.cognome,
      $scope.data.email,
      $scope.data.saldo,
      document.getElementById('upfile').files[0]
    ).success(function(data){

      console.log("Creato con successo");
      console.log(data);

      var id = data.id_utente;

      sharedProperties.setIdUtente(data.id_utente);
      sharedProperties.setNome(data.nome);
      sharedProperties.setCognome(data.cognome);
      sharedProperties.setSaldo(data.saldo);
      localStorage.setItem("username", data.username);
      localStorage.setItem("password", $scope.data.password);

      $scope.closeModal();
        $scope.loginData.username = localStorage.getItem("username");
        $scope.loginData.password = localStorage.getItem("password");
        $scope.doLogin();

    });
  }

  $scope.getFile = function(){
   document.getElementById("upfile").click();
  }

  $scope.setFile = function(element) {
        $scope.$apply(function($scope) {
        var file = element.files[0];
        if (element.files && element.files[0]) {
          $scope.imgProfilo = element.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgProfilo')
                    .attr('src', e.target.result)
                    .width(130)
                    .height(130);
            };

            reader.readAsDataURL(element.files[0]);
        }
      })
    };

});
