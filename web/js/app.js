/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
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

readerApp.controller('MainCtrl', function($scope, fetchfedora, $modal, $log) {
    $scope.oneAtATime = true;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

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
                if (angular.isUndefined(tag)) {
                    console.log(tag);
                }
                else {
                    $scope.tags.push(tag);
                }
                ;
            });
        });
    };


    //modal
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function(size) {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl,
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

    var ModalInstanceCtrl = function($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function() {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

    //end modal


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
                if(!immediate) {
                    deferred.resolve(func.apply(context, args));
                    deferred = $q.defer();
                }
            };
            var callNow = immediate && !timeout;
            if ( timeout ) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(later, wait);
            if (callNow) {
                deferred.resolve(func.apply(context,args));
                deferred = $q.defer();
            }
            return deferred.promise;
        };
    };
});


readerApp.controller('WordCtrl', function ($scope, debounce) {

    $scope.words = [];
    $scope.sentence = '';

    // this is called when the textarea is changed
    // it splits up the textarea's text and updates $scope.words 
    $scope.parseSentence = function() {

        var words = $scope.sentence.split(/\s+/g);
        var wordObjects = [];

        for (var i = 0; i < words.length; i++) {
            wordObjects.push({word: words[i]});
        }

        if ((words.length == 1) && (words[0] === '')) {
            // do not render any inputs when the sentence has no words
            $scope.words = [];
        } else {
            $scope.words = wordObjects;
        }

    };

    $scope.parseSentenceDebounced = debounce($scope.parseSentence, 700, false);

    $scope.buildSentance = function(w) {

        var words = [];

        for (var i = 0; i < $scope.words.length; i++) {
            var word = $scope.words[i].word;
            if (word.replace(/\s+/g, '') !== '') {
                words.push(word);
            }
        }

        $scope.sentence = words.join(' ');

        // debounce the call to parseSentenceDebounced
        // so that it only gets called after the user
        // has stopped typing instead of with every keypress
        $scope.parseSentenceDebounced();

    }

    $scope.parseSentence();





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