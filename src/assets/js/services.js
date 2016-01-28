angular.module('artApp.services',[])
.factory('Users', ['$resource', '$http','store', '$cacheFactory',
 function($resource, $http, store, $cacheFactory){
   var usersCache = $cacheFactory('Users')
  var _user =  "";
  var UserRes = $resource('https://1440ca01.ngrok.io/users/:userId',{userId: '@id'})
  return {
    _user: _user,
    setCurrent: function(){

    },
    signIn: function(){
      return $resource('https://1440ca01.ngrok.io/users/login')
    },
    res: function(){
      return $resource('https://1440ca01.ngrok.io/users/:id', {id: '@id'}, {
        'get': { method: 'GET', cache: usersCache},
        'query' : {method: 'GET', cache: usersCache, isArray:true }
      })
    },
    createUser: function(newUser){
      var user = new UserRes({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password
      })
      console.log("!")
      user.$save(function(data){
        console.log(data)
        return data
      })
    }
  }
}])
.factory('Token', function($resource, store, $state, $cacheFactory){

  var TokenRes = $resource('https://1440ca01.ngrok.io/knock/auth_token')
  return {
    getToken: function(logindetail){
      TokenRes.save({
        auth: {
          email: logindetail.email,
          password: logindetail.password
        }
      }, function(data){
        store.set('sessToken',data);
        return data
      }, function(err){
        console.log(err)
        $state.go('app.login');
      })
    }
  }
})
.factory('Art', function(){
  var artArray = []
  return {
    art: artArray
  }
})
.factory('Artists', ['$resource', '$cacheFactory', 'store',
 function($resource, $cacheFactory, store){
  var artistsCache = $cacheFactory('Artists');
  var ArtistRes = $resource('https://1440ca01.ngrok.io/artists/:artistId',{artistId: '@id'})
  var apiBseURl = "https://1440ca01.ngrok.io"
  var token = store.get('sessToken');
  // return {
  //   createArtist: function(newArtist){
  //     var artist = new ArtistRes({
  //       name: newArtist.name,
  //       bio: newArtist.bio,
  //       location: newArtist.location,
  //       email: newArtist.email,
  //       phone: newArtist.phone,
  //       artist_name: newArtist.artist_name,
  //       tags: newArtist.tags
  //     })
  //     console.log("!")
  //     artist.$save(function(data){
  //       return data
  //     })
  //   },
  //   getArtists:  function() {
  //       ArtistRes.query(function(data){
  //         artists = data;
  //       }, function(err){
  //         console.log(err)
  //       })
  //     },
  //   res: function(){
  //
  //
  return $resource('https://1440ca01.ngrok.io/artists/:id', {id: '@id'}, {
        'get': { method: 'GET', headers: { 'Authorization': 'Bearer' + token }, cache: artistsCache},
        'save': { method: 'POST', headers: { 'Authorization': 'Bearer' + token }},
        'query' : {method: 'GET',headers: { 'Authorization': 'Bearer' + token }, cache: artistsCache, isArray:true }
      })

}])
.factory('Pieces', ['$resource','$cacheFactory', 'store',
  function($resource,$cacheFactory, store){
    var token = store.get('sessToken');
    var piecesCache = $cacheFactory('Pieces')
    return $resource('https://1440ca01.ngrok.io/pieces/:id', {id: '@id'}, {
      'get': { method: 'GET', headers: { 'Authorization': token }, cache: piecesCache},
      'save': { method: 'POST', headers: { 'Authorization': token }},
      'query' : {method: 'GET',headers: { 'Authorization': token }, cache: piecesCache, isArray:true }
    })
}])
.factory('Gallery', ['$resource','$cacheFactory', 'store',
  function($resource,$cacheFactory, store){
    var token = store.get('sessToken');
    var galleryCache = $cacheFactory('Gallery')
    return $resource('https://1440ca01.ngrok.io/artists/:artist_id/galleries/:id', {artist_id: '@artist_id', id: '@id'}, {
      'get': { method: 'GET', headers: { 'Authorization': token }, cache: galleryCache},
      'save': { method: 'POST', headers: { 'Authorization': token }},
      'query' : {method: 'GET',headers: { 'Authorization': token }, cache: galleryCache, isArray:true }
    })
}])
.factory('Fave', ['$resource','$cacheFactory', 'store',
  function($resource,$cacheFactory, store){
    var token = store.get('sessToken');
    var favesCache = $cacheFactory('Faves')
    return $resource('https://1440ca01.ngrok.io/:userId/favourites/:id', {userID: '@userId', id: '@id'}, {
      'get': { method: 'GET', headers: { 'Authorization': token }, cache: favesCache},
      'save': { method: 'POST', headers: { 'Authorization': token }},
      'query' : {method: 'GET',headers: { 'Authorization': token }, cache: favesCache, isArray:true }
    })
}])
