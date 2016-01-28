angular.module('artApp.controllers',['artApp.services'])
// .controller('LoginCtrl', ['$scope', '$http', 'auth', 'store', '$state',
// function ($scope, $http, auth, store, $state) {
//   $scope.login = function () {
//     auth.signin({}, function (profile, token) {
//       // Success callback
//       store.set('profile', profile);
//       store.set('token', token);
//       $state.go('app.profile');
//     }, function (err) {
//       console.log(err)
//     });
//   };
//   $scope.logout = function() {
//     auth.signout();
//     store.remove('profile');
//     store.remove('token');
//   };
// }])
.controller('AppCtrl',['$scope', 'store', '$state', function($scope, store, $state){
  $scope.user = store.get('user')
  $scope.artist = store.get('artist')
  console.log($scope.artist)
  $scope.logout = function(){
    store.remove('user');
    store.remove('sessToken');
    $state.go('app.landing')
  }
}])
.controller('LoginCtrl', ['$scope', 'Users', 'Artists', 'store', '$state','Token',
function ($scope, Users, Artists, store, $state, Token) {

  $scope.logindetail = {
    email: "",
    password: ""
  }
  var profile = Users.signIn();
  $scope.login = function () {
      console.log($scope.logindetail)
    Token.getToken($scope.logindetail)
    profile.save({email: $scope.logindetail.email, password: $scope.logindetail.password},
       function(data){
         store.set('user', data.user)
         store.set('artist', data.artist)
         console.log(data)
         $scope.user = data.user;
         $scope.artist = data.artist;
       }, function(err){
         console.log(err);
       });
       //
      //  if ($scope.user.artist) {
      //    ArtistRes.get({id: $scope.user.id}, function(artist){
      //      console.log(err);
      //      store.set('user_artist', artist)
      //    }, function(err){
      //      console.log(err);
      //    })
      //  }
    $state.go('app.dashboard')
  };
  console.log($scope.user)
  console.log($scope.artist)
  $scope.logout = function() {

    store.remove('profile');
    store.remove('token');
  };

}])

.controller('LandingCtrl',['$scope','$uibModal','store',
 function($scope, $uibModal, store){
  $scope.openSignUp = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'templates/signupModal.html',
        controller: 'SignUpModalCtrl'
        // resolve: {
        //   artist: function(){
        //
        //   }
        // }
      });
    };
    console.log(store.get('sessToken'))
}])
.controller('SignUpModalCtrl', function($scope, $uibModalInstance, Users){
  $scope.newUser = {
    name: "",
    email: "",
    password:""
  }
  $scope.createUser = function(){
    console.log("!")
    Users.createUser($scope.newUser);
  }
  $scope.close = function(){
    $uibModalInstance.close();
  }
})

.controller('AboutCtrl',['$scope',function($scope){

}])
.controller('ExhibitCtrl',['$scope',function($scope){

}])
.controller('DashboardCtrl',['$scope', 'Users', 'Art', 'store','Pieces','Artists','$uibModal', '$http',
 function($scope, Users, Art, store, Pieces, Artists, $uibModal, $http){
  $scope.pieces = Pieces.query(function(data){
    $scope.pieces = data;
  }, function(err){
    console.log(err);
  });
  // ArtistRes.get({id: $scope.user.id}).$promise.then(function(data){
  //    $scope.artist = data;
  //   console.log(data);
  // })
  // Artists.get({id: $scope.user.id}).$promise.then(function(data){
  //   $scope.artist = data;
  //   store.set('user_artist', data)
  // }, function(err){
  //   console.log(err);
  // });
  console.log($scope.user)
  // $scope.artist = $http.get('https://2c18ebbc.ngrok.io/artists/data', {id: '$scope.user.id'}).then(function(data){
  //   $scope.artist = data;
  // });

  $scope.latestArray = [];
  $scope.recArray = [];
  $scope.saleArray = [];
  $scope.user = store.get('user');
  $scope.artist = store.get('artist');
  console.log($scope.artist);
  $scope.openGal = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'templates/galModal.html',
        controller: 'CreateGalModalCtrl',
        resolve: {
          user: function(){
            return $scope.user
          },
          artist: function(){
            return $scope.artist
          },
        }
      });
    };
}])
.controller('CreateGalModalCtrl', function($scope, $uibModalInstance, user, artist, Gallery){

  $scope.c_user = user;
  $scope.u_artist = artist;
  console.log($scope.u_artist)
  $scope.newGal = {
    title: "",
    description: "",
    user_id: $scope.c_user.id,
    artist_id: $scope.u_artist.id
  }
  $scope.createGal = function(){
    console.log("!")
    Gallery.save({title: $scope.newGal.title, description: $scope.newGal.description, artist_id: $scope.newGal.artist_id, user_id: $scope.newGal.user_id});
  }
  $scope.close = function(){
    $uibModalInstance.close();
  }
})

.controller('ArtistsCtrl',['$scope', 'Users', 'Art','$uibModal','Artists',
 function($scope, Users, Art, $uibModal, Artists){
  $scope.artists = [];
  var artist =  Artists;
  artist.query(function(data){
    $scope.artists = data;
  }, function(err){
    console.log("err")
  })

  $scope.latestArray = [];
  $scope.recArray = [];
  $scope.saleArray = [];
  $scope.openSignUp = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'templates/artsignupModal.html',
        controller: 'ArtSignUpModalCtrl'
        // resolve: {
        //   artist: function(){
        //
        //   }
        // }
      });
    };
    //
    // $scope.post1 = Blog.getPost();

}])
.controller('ArtSignUpModalCtrl', function($scope, $uibModalInstance, auth, Artists){
  $scope.user = auth.profile;
  $scope.newArtist = {
    name: $scope.user.name,
    user_id: $scope.user.user_id,
    email: $scope.user.email,
    location: "",
    phone: "",
    bio:"",
    tags: []
  }
  $scope.createArtist = function(newArtist){
      var artist = new Artists({
        name: newArtist.name,
        bio: newArtist.bio,
        location: newArtist.location,
        email: newArtist.email,
        phone: newArtist.phone,
        artist_name: newArtist.artist_name,
        tags: newArtist.tags
      })
      console.log("!")
      artist.$save(function(data){
        return data
      });
    };
  $scope.close = function(){
    $uibModalInstance.close();
  }
})
.controller('ArtCtrl', ['$scope','store', 'Pieces', 'Artists', 'Users',
  function($scope, store, Pieces, Artists, Users){
    $scope.artArray = Pieces.query(function(data){
      $scope.artArray = data;
    }, function(err){
      console.log(err);
    })
    console.log($scope.artArray)
}])
.controller('PieceCtrl', ['$scope','store', 'Pieces', 'Artists', 'Users', '$stateParams',
  function($scope, store, Pieces, Artists, Users, $stateParams){
    console.log($scope.user)
    console.log($stateParams.pieceId)
    console.log($stateParams)
    $scope.piece = Pieces.get({id: $stateParams.pieceId});
    $scope.piece.$promise.then(function(data){

      $scope.piece = data;
    }, function(err){
      console.log(err);
    })

}])
.controller('ManageCtrl', ['$scope', 'Upload', 'Gallery',
 function($scope, Upload, Gallery){
   $scope.newGal = {
     title: "",
     description: ""
   }
   $scope.uploadFiles = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          Upload.upload({url: 'https://2c18ebbc.ngrok.io', data: {file: files[i]}});
        }
        // // or send them all together for HTML5 browsers:
        // Upload.upload({'https://2c18ebbc.ngrok.io', data: {file: files}, ...})...;
      }
    }
}])
.controller('FeedCtrl', ['$scope','store', 'Pieces', 'Artists', 'Users', '$stateParams',
  function($scope, store, Pieces, Artists, Users, $stateParams){

}])
.controller('FavouritesCtrl', ['$scope','store', 'Pieces', 'Artists', 'Users', '$stateParams', 'Fave',
  function($scope, store, Pieces, Artists, Users, $stateParams, Fave){
    $scope.addFave = function(art){


    }
}])
