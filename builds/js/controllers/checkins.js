myApp.controller('CheckInsController',
  ['$scope', '$rootScope', '$firebaseAuth', '$routeParams', '$firebaseObject', '$firebaseArray', '$location',
    function($scope, $rootScope, $firebaseAuth, $routeParams, $firebaseObject, $firebaseArray, $location) {

      var ref;
      $scope.whichmeeting = $routeParams.mId;
      $scope.whichuser = $routeParams.uId;

      ref = firebase.database().ref()
        .child('users')
        .child($scope.whichuser)
        .child('meetings')
        .child($scope.whichmeeting)
        .child('checkins');

      checkinsList = $firebaseArray(ref);
      $scope.checkins = checkinsList;

      $scope.order = 'firstname';
      $scope.direction = null;
      $scope.query = '';
      $scope.recordId = '';
      $scope.pickRandom = function() {
        var whichRecord = Math.round(Math.random() * (checkinsList.length - 1));
        $scope.recordId = checkinsList.$keyAt(whichRecord);
      }

      $scope.addCheckin = function() {
        $firebaseArray(ref).$add({
          firstname: $scope.user.firstname,
          lastname: $scope.user.lastname,
          email: $scope.user.email,
          date: firebase.database.ServerValue.TIMESTAMP
        }).then(function() {
          $location.path('/checkins/' + $scope.whichuser + '/' + $scope.whichmeeting + '/checkinsList');
        });
      }

      $scope.deleteCheckin = function(id) {
        var refDel = ref.child(id);
        var record = $firebaseObject(refDel);
        record.$remove(id);
      }

}]);
