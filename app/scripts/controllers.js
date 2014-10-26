'use strict';
angular.module('dribbbleApp.controllers', ['ionic'])

.controller('MainCtrl', function($scope, $state, $http, $q) {
  $scope.viewList = {list: [
    {
      name:'Popular',
      api_url:'http://api.dribbble.com/shots/popular?callback=JSON_CALLBACK',
      total_page: 0,
      current_page:0,
    },
    {
      name:'Latest',
      api_url:'http://api.dribbble.com/shots/everyone?callback=JSON_CALLBACK',
      total_page: 0,
      current_page:0,
    }
  ]};

  $scope.getShots = function(){
    $scope.getImages()
    .then(function(res){
      angular.forEach(res.shots, function(shot){
        $scope.shotList.push(shot);
      })
      $scope.currentPage.current_page = parseInt(res.page);
      $scope.currentPage.total_page = parseInt(res.pages);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, function (status){
      $scope.pageError = satus
    })
  }
  $scope.getNewShots = function (){
    $scope.currentPage.current_page = 1
    $scope.getImages()
    .then(function(res){
      $scope.shotList = angular.copy(res.shots)
      $scope.currentPage.current_page = parseInt(res.page);
      $scope.currentPage.total_page = parseInt(res.pages);
    }, function (status){
      $scope.pageError = satus
    })
  }

  $scope.init = function(){
    $scope.pageIndex = 0
    $scope.currentPage = $scope.viewList.list[$scope.pageIndex];
    $scope.shotList = [];
  };
  $scope.onSwipe= function(event){
    switch(event.gesture.direction){
      case 'right': 
        $scope.changeView('next');
        break;
      case 'left': 
        $scope.changeView('prev');
        break;
    }
  }

  $scope.changeView = function (direction){
    var max = $scope.viewList.list.length-1;
    if(direction == 'next'){
      if($scope.pageIndex < max){
        $scope.pageIndex++;
      }else if ($scope.pageIndex == max){
        $scope.pageIndex = 0;
      }
    }
    if(direction == 'prev'){
      if($scope.pageIndex > 0){
        $scope.pageIndex--;
      }else if ($scope.pageIndex == 0){
        $scope.pageIndex = max
      }
    }
    $scope.currentPage = $scope.viewList.list[$scope.pageIndex];
    $scope.currentPage.current_page = 1
    $scope.getNewShots();
  }

  $scope.getImages = function(){
    var path_to_call = $scope.currentPage.api_url+'&page='+$scope.currentPage.current_page;
    var defer = $q.defer();

    $http.jsonp(path_to_call)
    .success(function(res){
      defer.resolve(res);
    })
    .error(function(status,err){
      defer.reject(status);
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    })

    return defer.promise;
  };

  $scope.doRefresh= function(){
    $scope.getNewShots();
  }
  $scope.loadMore= function(){
    $scope.currentPage.current_page++;
    $scope.getShots();
  }


  $scope.init();
})

.controller('ShotCtrl', function($scope, $state, $http, $q) {
  // console.log('unique controller');

});