'use strict';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* Services */

var readerAppServices = angular.module('readerAppServices', []);



readerAppServices.factory('generateUUID', function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxx'.replace(/[xy]/g, function(c) {
        //var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return "1" + uuid;
});



readerAppServices.factory('fedoraServiceXML', function($http, $q) {
    var deferred = $q.defer();
    var x = {fetch: function(url) {
            $http.get(url).success(function(data) {
                var x2js = new X2JS();
                var d = x2js.xml_str2json(data);
                return d;
                //console.log(d);
                //deferred.resolve(d);
            })

            return deferred.promise;
            //console.log(deferred.promise);
            
        }
    }
    console.log(x);
    return x;




})


readerAppServices.factory('fedoraServiceJSON', function($q, $http) {


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
                //deferred.resolve(data);
                jsonld.compact(data, context, function(err, compacted) {

                    deferred.resolve(compacted);
                });
            }).error(function(headers, status) {
                if (status == 404) {
                    console.log("OK", url);
                    $http({
                        method: 'PUT',
                        url: url

                    }).success(function(data) {
                        console.log("OK", url);

                    }).error(function(err) {
                        "ERR", console.log(err)
                    });
                }


            });
            //console.info(deferred.promise);
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



readerAppServices.factory('requestRejector', ['$q', function($q) {
        var requestRejector = {
            request: function(config) {
                return $q.reject('requestRejector');
            }
        };
        return requestRejector;
    }]);

readerAppServices.factory('requestRecoverer', ['$q', function($q) {
        var requestRecoverer = {
            requestError: function(rejectReason) {
                if (rejectReason === 'requestRejector') {
                    // Recover the request
                    return {
                        transformRequest: [],
                        transformResponse: [],
                        method: 'GET',
                        url: 'http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0007/',
                        headers: {
                            Accept: 'application/ld+json, text/plain, */*'
                        }
                    };
                } else {
                    return $q.reject(rejectReason);
                }
            }
        };
        return requestRecoverer;
    }]);

