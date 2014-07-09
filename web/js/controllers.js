/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var readerAppControllers = angular.module('readerAppControllers', []);
readerAppControllers.controller('MainCtrl', function($scope, fetchfedora, $modal, $log, $http, $window, $route, $location, generateUUID) {
    $scope.oneAtATime = true;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };



    var prefix = 'fedora/rest';
    var collection = $location.$$path;
    //http://pers31.ub.uni-heidelberg.de:8080/annotations-reader/index.html#/image=de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001
    var url = $location.$$protocol + "://" + $location.$$host + ':' + $location.$$port + '/' + prefix + '/' + collection;
    //var new_id = Math.floor(Math.random() * 1000000000000000000000);
    console.log("location", $location);


    console.log("url", url);

    fetchfedora.fetch(url).then(function(data) {
        //cut the main element
        $scope.posts = data;
        if (data['@graph'] == true) {
            $scope.posts = data['@graph'].splice(1, data['@graph'].length - 1);
            sort_text = 'fcrepo:#created';
            $scope.posts.sort(function(a, b) {
                if (a[sort_text] < b[sort_text])
                    return 1;
                if (a[sort_text] > b[sort_text])
                    return -1;

                return 0;
            });
            //console.log("after", $scope.posts);

            $scope.child_url = url + '/' + $scope.posts.length + 1;
            console.log("location", $location);
            console.log("$scope.child_url", $scope.child_url);
            $scope.posts = $scope.posts.sort();
        }

    });



    //form
    $scope.submit = function() {
        $scope.title = this.title;
        $scope.text = this.text;

        $scope.postdata = [{
                "@id": $scope.child_url,
                "@type": ["http://www.w3.org/ns/ldp#Container", "http://www.w3.org/ns/ldp#DirectContainer", "http://www.jcp.org/jcr/nt/1.0folder", "http://www.jcp.org/jcr/nt/1.0hierarchyNode", "http://www.jcp.org/jcr/nt/1.0base", "http://www.jcp.org/jcr/mix/1.0created", "http://www.w3.org/ns/oa#Annotation", "http://fedora.info/definitions/v4/rest-api#resource", "http://fedora.info/definitions/v4/rest-api#object", "http://fedora.info/definitions/v4/rest-api#relations", "http://www.jcp.org/jcr/mix/1.0lastModified", "http://www.jcp.org/jcr/mix/1.0lockable", "http://www.jcp.org/jcr/mix/1.0referenceable", "http://purl.org/dc/elements/1.1/describable"],
                "http://purl.org/dc/elements/1.1/format": [{
                        "@value": "text/html"
                    }],
                "http://purl.org/dc/elements/1.1/language": [{
                        "@value": "de"
                    }],
                "http://purl.org/dc/elements/1.1/title": [{
                        "@value": $scope.title
                    }],
                "http://www.w3.org/2011/content#characterEncoding": [{
                        "@value": "utf-8"
                    }],
                "http://www.w3.org/2011/content#chars": [{
                        "@value": $scope.text
                    }]

            }];


        $http({
            method: 'PUT',
            url: $scope.child_url,
            data: $scope.postdata,
            headers: {
                'Content-Type': 'application/ld+json'

            }
        }).success(function(data) {
            console.log("OK", $scope.postdata)

        }).error(function(err) {
            "ERR", console.log(err)
        });

        /**
         fetchfedora.fetch(url).then(function(data) {
         $scope.posts = "";
         console.log("debug", $scope.posts);
         });
         
         $route.reload();
         $window.location.reload();
         //$scope.$apply( $location.path( url ) );
         **/

    };








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



readerAppControllers.controller('WordCtrl', function($scope, debounce) {

    $scope.words = [];
    $scope.sentence = '';

    $scope.parseSentence = function() {
        var words = $scope.sentence.split(/\s+/g);
        var wordObjects = [];
        for (var i = 0; i < words.length; i++) {
            wordObjects.push({word: words[i]});
        }
        if ((words.length == 1) && (words[0] === '')) {      // do not render any inputs when the sentence has no words
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
        $scope.parseSentenceDebounced();

    }

    $scope.parseSentence();

});



