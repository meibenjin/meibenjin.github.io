app = angular.module('blog', ['ngSanitize']).config([
    '$routeProvider', "$locationProvider", function($routeProvider, $locationProvider) {
      return $routeProvider.when("", {
        templateUrl:"partials/home.html"
      }).when("/Home", {
        templateUrl: "partials/home.html"
      }).when("/Blog", {
        templateUrl: "partials/home.html"
      }).when("/Resume", {
        templateUrl: "partials/resume.html#resume"
      }).when("/tag/:tag", {
        templateUrl: "partials/index-list.html"
      }).when("/post/:postPath", {
        templateUrl: "partials/post.html"
      });
    }
  ]).directive('ngMarkdown', function() {
    return function(scope, element, attrs) {
      return scope.$watch(attrs.ngMarkdown, function(value) {
        var el, html, _i, _len, _ref;
        if (value != null) {
          html = converter.makeHtml(value);
          element.html(html);
          _ref = document.body.querySelectorAll('pre code');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            hljs.highlightBlock(el);
          }
          return MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
      });
    };
  }).factory("indexService", function($http) {
    var indexService;
    indexService = {
      async: function() {
        var promise;
        promise = $http.get('post/index.json').then(function(response) {
          return response.data;
        });
        return promise;
      }
    };
    return indexService;
  });

app.controller('navbar_ctrl', function($scope, $http, $location) {
    return $http.get("config.json").success(function(data) {
      var getState;
      getState = function(path) {
        var items;
        items = path.split("/");
        if (items.length > 1 ) {
          return items[items.length - 1];
        }
        return "Home";
      };
      $scope.state = getState($location.path());
      $scope.config = data;

      return $scope.$on("$locationChangeSuccess", function(event, newLoc, oldLoc) {
        $scope.state = getState($location.path());
        document.getElementById("nav_bar").style.position = "absolute";
        return $scope.state;
      });
    });
  });

app.controller('resume_ctrl', function($scope, $http) {
    return $http.get("resume.json").success(function(data) {
      document.getElementById("nav_bar").style.position = "relative";
      return $scope.resume = data;
    });
  });