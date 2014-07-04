/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * 
 * TODO: automatische tags zur markiterung
 */

var readerApps = angular.module('readerApp', ['ui.bootstrap', 'ngTouch'], function($httpProvider) {
    FastClick.attach(document.body);
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}).run(['$location', function($location) {
        //Allows us to navigate to the correct element on initialization
        if ($location.path() !== '' && $location.path() !== '/') {
            smoothScroll(document.getElementById($location.path().substring(1)), 500, function(el) {
                location.replace(el.id);
            });
        }
    }]);



var readerApp = angular.module('readerApp', ['ui.bootstrap', 'ngTouch']);

readerApp.controller('MainCtrl', function($scope, fetchfedora) {
    $scope.oneAtATime = true;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
    $scope.posts = {};
    url = '../fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/';
    fetchfedora.fetch(url).then(function(data) {
        $scope.posts = data;
        //console.log(data);
    });
    $scope.tags = [];
    $scope.getdata = function(url, values) {

        angular.forEach(values, function(value, key) {
            //console.log(value['@id']);
            fetchfedora.fetch(value['@id']).then(function(data) {
                var tag = data['@graph']['0']['oa:#hasBody'];
                //var tag = data['@graph']['0']['oa:#hasBody'];
                if (angular.isUndefined(tag)) {
                    console.log(tag);

                }
                else {
                    //console.log("defined", tag);
                    $scope.tags.push(tag);
                }
                ;
            });
            //this.push(key + ': ' + value);
        });
        /**
         
         fetchfedora.fetch(annotationbody).then(function(data) {
         
         //console.log(values);
         angular.forEach(values, function(value, key) {
         console.log(value);
         }
         );
         });
         **/
    };

});

readerApp.factory('fetchfedora', function($q, $http) {


    var context = {
        "fcrepo": "http://fedora.info/definitions/v4/repository",
        "cnt": 'http://www.w3.org/2011/content',
        "rest": 'http://fedora.info/definitions/v4/rest-api',
        "ldp": "http://www.w3.org/ns/ldp",
        "dc": "http://purl.org/dc/elements/1.1/",
        "oa": "http://www.w3.org/ns/oa",
        "mixin": "http://www.jcp.org/jcr/mix/1.0",
        "oax": 'http://www.w3.org/ns/openannotation/extensions/',
    };

    var Webtest = {
        fetch: function(url) {
            var deferred = $q.defer();
            var config = {headers: {"Accept": "application/ld+json"}};

            $http.get(url, config).success(function(data) {
                //console.log(data);
                jsonld.compact(data, context, function(compacted) {
                    deferred.resolve(compacted);
                });
            });
            return deferred.promise;
        }
    };

    return Webtest;
});

readerApp.config(['$httpProvider', function($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }]);



/**
 
 function readerCtrl($scope, $http) {
 var context = {
 "fcrepo": "http://fedora.info/definitions/v4/repository",
 "cnt": 'http://www.w3.org/2011/content',
 "rest": 'http://fedora.info/definitions/v4/rest-api',
 "ldp": "http://www.w3.org/ns/ldp",
 "dc": "http://purl.org/dc/elements/1.1/",
 "oa": "http://www.w3.org/ns/oa",
 "mixin": "http://www.jcp.org/jcr/mix/1.0",
 };
 
 headers = {'Accept': 'application/ld + json'};
 url = '../fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/';
 $http.get(url).
 success(function(data, status, headers, config) {
 
 jsonld.compact(data, context, function(err, compacted) {
 $scope.posts = compacted;
 console.log("data", $scope.posts);
 });
 }).
 error(function(data, status, headers, config) {
 console.log(url + " not exists");
 });
 
 $scope.oneAtATime = true;
 
 $scope.status = {
 isFirstOpen: true,
 isFirstDisabled: false
 };
 }
 
 
 
 function Reader($scope, $http) {
 var folder = '../';
 //var uuid = 'fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/';
 var uuid = 'fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/';
 var template = 'default';
 $http.get(folder + uuid + 'fcr:transform/' + template).
 success(function(data) {
 $scope.annotation = data;
 });
 }
 
 
 **/