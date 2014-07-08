'use strict';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */


var readerApp = angular.module('readerApp',
        ['ui.bootstrap',
            'ngTouch',
            'readerAppControllers',
            
        ]);



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
                console.log(data);
                jsonld.compact(data, context, function(err, compacted) {
                    deferred.resolve(compacted);
                });
            });
            return deferred.promise;
        }
    };

    return Webtest;
});


readerApp.factory('debounce', function($timeout, $q) {
    return function(func, wait, immediate) {
        var timeout;
        var deferred = $q.defer();
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    deferred.resolve(func.apply(context, args));
                    deferred = $q.defer();
                }
            };
            var callNow = immediate && !timeout;
            if (timeout) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(later, wait);
            if (callNow) {
                deferred.resolve(func.apply(context, args));
                deferred = $q.defer();
            }
            return deferred.promise;
        };
    };
});





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