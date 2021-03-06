'use strict';

// files controller
angular.module('files').controller('FilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Files', 'FileUploader', '$timeout', '$window', '$http',
  function($scope, $stateParams, $location, Authentication, Files, FileUploader, $timeout, $window, $http) {
    $scope.authentication = Authentication;

    // Create new File
    $scope.create = function(isValid) {
      //$scope.uploadFile();
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'fileForm');

        return false;
      }
      var fd = new FormData();
      fd.append('uploadFile', $scope.newFile);
      fd.append('title', $scope.title);
      fd.append('content', $scope.content);

      $http.post('api/files', fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })

        .success(function(response) {
          $scope.success = true;

          $location.path('files/' + response._id);
        })

        .error(function() {});
    };

    $scope.download = function () {
      // window.location.href('api/get-file/'+$stateParams.fileId)
      $http.get('api/get-file/'+$stateParams.fileId)

      .success(function(response){
      })

      .error(function(){
      });
    };
    // Remove existing file
    $scope.remove = function(file) {
      if (file) {
        file.$remove();

        for (var i in $scope.files) {
          if ($scope.files[i] === file) {
            $scope.files.splice(i, 1);
          }
        }
      } else {
        $scope.file.$remove(function() {
          $location.path('files');
        });
      }
    };

    // Update existing file
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'fileForm');

        return false;
      }

      var file = $scope.file;

      file.$update(function() {
        $location.path('files/' + file._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of files
    $scope.find = function() {
      $scope.files = Files.query();
    };

    $scope.fileFilter = function(file,type){
      if(!type)return true;
      if(type.slice(-1) === '*')
        return file.filetype.substr(0, file.filetype.indexOf('/')) === type.substr(0, type.indexOf('/'));
      else
        return file.filetype === type;
    };

    // Find existing file
    $scope.findOne = function() {
      $scope.file = Files.get({
        fileId: $stateParams.fileId
      });
    };
    $scope.showImage = function(){
      console.log('Show Image');
      $scope.files = Files.query();
    };
  }
])
.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);
