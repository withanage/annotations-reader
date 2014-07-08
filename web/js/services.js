'use strict';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* Services */

var readerAppServices = angular.module('readerAppServices',[]);


readerAppServices.factory('fetchfedora', function($q, $http) {


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

    var jsonld_download = {
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

    return jsonld_download;
});


readerAppServices.factory('debounce', function($timeout, $q) {
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



