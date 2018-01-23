myApp.factory('Authentication',
  ['$rootScope', '$firebaseAuth', '$firebaseObject', '$location',
  function($rootScope, $firebaseAuth, $firebaseObject, $location) {

  var ref = firebase.database().ref();
  var auth = $firebaseAuth();
  var myObject;

  auth.$onAuthStateChanged(function(authUser) {
    if(authUser) {
      var userRef = ref.child('users').child(authUser.uid);
      var userObj = $firebaseObject(userRef);

      $rootScope.currentUser = userObj;
    } else {
      $rootScope.currentUser = '';
    }
  });

  myObject =  {
    login: function(user) {
      auth.$signInWithEmailAndPassword(user.email, user.password)
        .then(function(user) {
          $location.path('/success')
        }).catch(function(error) {
          $rootScope.message = error.message;
        });
    },

    register: function(user) {
      auth.$createUserWithEmailAndPassword(user.email, user.password)
        .then(function(regUser) {

          var regRef = ref.child('users').child(regUser.uid).set({
            date: firebase.database.ServerValue.TIMESTAMP,
            regUser: regUser.uid,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
          })
          myObject.login(user);
        }).catch(function(error) {
          $rootScope.message = error.message;
        });
    },

    logout: function() {
      return auth.$signOut();
    },

    requireAuth: function() {
      return auth.$requireSignIn();
    }
  };

  return myObject;
}]);  //rootScope is available in entire application
