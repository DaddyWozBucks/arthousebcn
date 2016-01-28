
  angular.module('artApp', ['artApp.services',
    'artApp.controllers',
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'ngResource',
    'ngFileUpload',
    'auth0',
    'angular-storage',
    'angular-jwt'])
.run(function(auth) {
  auth.hookEvents();
})
.config(['$stateProvider', '$urlRouterProvider', 'authProvider',  '$httpProvider', 'jwtInterceptorProvider',
 function($stateProvider, $urlRouterProvider, authProvider,  $httpProvider, jwtInterceptorProvider) {
  $urlRouterProvider.otherwise('/app/');
  $stateProvider
      .state('app',{
        url: '/app',
        abstract: true,
        views: {
          "header": { templateUrl: "templates/app.html", controller: "AppCtrl" }
        }
      })
      .state('app.landing',{
        url: '/',
        views: {
          "main": { templateUrl: "templates/landing.html", controller: "LandingCtrl"}
        }
      })
      .state('app.about',{
        url: '/about',
        views: {
          "main": { templateUrl: "templates/about.html", controller: "AboutCtrl"}
        }
      })
      .state('app.login',{
        url: '/login',
        views: {
          "main": { templateUrl: "templates/login.html", controller: "LoginCtrl"}
        }
      })
      .state('app.art',{
        url: '/art',
        views: {
          "main": { templateUrl: "templates/art.html", controller: "ArtCtrl"}
        }
      })
      .state('app.piece',{
        url: '/art/:pieceId',
        views: {
          "main": { templateUrl: "templates/piece.html", controller: "PieceCtrl"}
        }
      })
      .state('app.dashboard',{
        url: '/dashboard',
        views: {
          "main": { templateUrl: "templates/dashboard.html", controller: "DashboardCtrl"}
          // "main@dashboard": { templateUrl: "templates/feed.html", controller: "FeedCtrl"}
        }
      })
      .state('app.dashboard.feed',{
        url: '/feed',
        views: {
          "dashboard": { templateUrl: "templates/feed.html", controller: "FeedCtrl"}
        }
      }).state('app.dashboard.favourites',{
        url: '/favourites',
        views: {
          "dashboard": { templateUrl: "templates/favourites.html", controller: "FavouritesCtrl"}
        }
      }).state('app.dashboard.manage',{
        url: '/manage',
        views: {
          "dashboard": { templateUrl: "templates/manage.html", controller: "ManageCtrl"}
        }
      })
      .state('app.artists',{
        url: '/artists',
        views: {
          "main": { templateUrl: "templates/artists.html", controller: "ArtistsCtrl"}
        }
      })
      .state('app.artists.detail',{
        url: '/artists/:artistId',
        views: {
          "main": { templateUrl: "templates/artist.html", controller: "ArtistCtrl"}
        }
      })
      .state('app.exhibits',{
        url: '/exhibits',
        views: {
          "main": { templateUrl: "templates/exhibits.html", controller: "ExhibitCtrl"}
        }
      })
      .state('app.profile',{
        url: 'artists/:artistId',
        views: {
          "main": { templateUrl: "templates/profile.html", controller: "DashboardCtrl"}
        }
      })

  authProvider.init({
    domain: 'noticiodev.eu.auth0.com',
    clientID: 'nNpSQcKRaedEsTACW7cJAOJKYU8BeQom',
    loginState: 'app.login'
  });
  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    // Return the saved token
    return store.get('token');
  }];
  $httpProvider.interceptors.push('jwtInterceptor');
}])
// .run(['$rootScope', 'auth', 'store', 'jwtHelper', '$state', function($rootScope, auth, store, jwtHelper, $state) {
//   // This events gets triggered on refresh or URL change
//   $rootScope.$on('$stateChangeStart', function() {
//     var token = store.get('sessToken');
//     if (token) {
//       if (!jwtHelper.isTokenExpired(token)) {
//         // if (!auth.isAuthenticated) {
//         //   auth.authenticate(store.get('profile'), token);
//         // }
//       } else {
//         // Either show the login page or use the refresh token to get a new idToken
//       $state.go('app.login');
//       }
//     }
//   });
// }]);
