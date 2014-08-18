function load_disqus() {
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'blogmbj';
    //var disqus_identifier = 'newid1';
    var disqus_url = 'http://www.meibenjin.cn/index.html';
    var disqus_config = function () { 
        this.language = "zh_cn";
    };

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
         var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
         dsq.src = 'http://www.meibenjin.cn/js/embed.js';
         (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
     })();

    /* * * Disqus Reset Function * * */
    var reset = function (newIdentifier, newUrl, newTitle, newLanguage) {
        DISQUS.reset({
            reload: true,
            config: function () {
                this.page.identifier = newIdentifier;
                this.page.url = newUrl;
                this.page.title = newTitle;
                this.language = newLanguage;
            }
        });
    };
}

function modify_nav_bar(value) {
  document.getElementById("nav_bar").style.position = value;
}

function toggle_disqus(value) {
 document.getElementById("disqus_thread").style.display = value; 
}

(function() {
  var app, converter;
  converter = new Showdown.converter();
  app = angular.module('blog', ['ngSanitize']).config([
      '$routeProvider', "$locationProvider", function($routeProvider, $locationProvider) {
        return $routeProvider.when("", {
          templateUrl:"partials/home.html"
        }).when("/Home", {
          templateUrl: "partials/home.html"
        }).when("/Blog", {
          templateUrl: "partials/posts_list.html"
        }).when("/Resume", {
          templateUrl: "partials/resume.html"
        }).when("/tag/:tag", {
          templateUrl: "partials/posts_list.html"
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

          modify_nav_bar("absolute");
          toggle_disqus("block");
          
          return $scope.state;
        });
      });
    });

  app.controller('resume_ctrl', function($scope, $http) {

      modify_nav_bar("relative");
      toggle_disqus("none");

      return $http.get("resume.json").success(function(data) {
        return $scope.resume = data;
      });
    });

  app.controller('posts_list_ctrl', function($scope, $routeParams, indexService) {
      modify_nav_bar("relative");
      return indexService.async().then(function(data) {
        var buildTagList, tag;
        buildTagList = function(indexData) {
          var all_tags, post, tag, tags, _i, _j, _len, _len1;
          all_tags = [];
          for (_i = 0, _len = indexData.length; _i < _len; _i++) {
            post = indexData[_i];
            all_tags = all_tags.concat(post.tags);
          }
          tags = {};
          for (_j = 0, _len1 = all_tags.length; _j < _len1; _j++) {
            tag = all_tags[_j];
            if (tags[tag]) {
              tags[tag]["count"] += 1;
            } else {
              tags[tag] = {
                "text": tag,
                "href": "#/tag/" + tag,
                "count": 1
              };
            }
          }
          tags["All"] = {
            "text": "All",
            "href": "#/Blog",
            "count": indexData.length
          };
          return tags;
        };
        $scope.indexList = data;
        indexService.indexData = data;
        $scope.tagList = buildTagList(data);
        if (($routeParams.tag != null) && $routeParams.tag.length !== 0) {
          tag = $routeParams.tag;
        } else {
          tag = "All";
        }
        $scope.currentTag = $scope.tagList[tag];
        if (tag === "All") {
          return $scope.currentTag.filter = "";
        } else {
          return $scope.currentTag.filter = tag;
        }
      });
    });

  app.controller('post_ctrl', function($scope, $http, $routeParams, indexService) {
      modify_nav_bar("relative");
      toggle_disqus("block");
      return $http.get("post/" + $routeParams.postPath + ".md").success(function(data) {
        $scope.postContent = data;
        return indexService.async().then(function(data) {
          var i, post, _i, _len, _results;
          i = 0;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            post = data[_i];
            if (post.path === $routeParams.postPath) {
              $scope.prevPostPath = "";
              $scope.nextPostPath = "";
              if (data[i - 1] != null) {
                $scope.prevPostPath = "#/post/" + data[i - 1].path;
              }
              if (data[i + 1] != null) {
                $scope.nextPostPath = "#/post/" + data[i + 1].path;
              }
              break;
            }
            _results.push(i++);
          }
          return _results;
        });
      });
    });

app.controller('resume_ctrl', function($scope, $http, $routeParams, indexService) {
      modify_nav_bar("relative");
      toggle_disqus("block");
      return $http.get("./Resume.md").success(function(data) {
        $scope.postContent = data;
      });
    });

}).call(this);

