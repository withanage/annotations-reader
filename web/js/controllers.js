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
    //http://pers31.ub.uni-heidelberg.de:8080/annotations-reader/index.html#/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/
    var url = $location.$$protocol + "://" + $location.$$host + ':' + $location.$$port + '/' + prefix + '' + collection;
    //var new_id = Math.floor(Math.random() * 1000000000000000000000);

    console.log("url", url);
    console.log("location", $location);

    fetchfedora.fetch(url).then(function(data) {
//cut the main element
        console.log("$data graph ", data['@graph'] != null);
        console.log("data", data);
        if (data['@graph'] != null) {
            $scope.posts = data['@graph'].splice(1, data['@graph'].length - 1);
            $scope.parent = data['@graph'];
            sort_text = 'fcrepo:#lastModified';
            $scope.posts.sort(function(a, b) {
                if (a[sort_text] < b[sort_text])
                    return 1;
                if (a[sort_text] > b[sort_text])
                    return -1;
                return 0;
            })
            $scope.posts = $scope.posts.sort();
            $scope.childurl = url + '/' + ($scope.posts != null ? $scope.posts.length + 1 : 1);
        }

    });
    //form
    $scope.submit = function(id) {

        if (id == null) {
            $scope.childurl = url + generateUUID;//''+ Math.floor(Math.random() * 10000000000000000);
            $scope.ctitle = this.title;
            $scope.ctext = this.text;
        }
        else {
            $scope.childurl = id + '/' + generateUUID;
            $scope.ctitle = this.ctitle;
            $scope.ctext = this.ctext;
        }

        $scope.postdata = [{
                "@id": $scope.childurl,
                "@type": ["http://www.w3.org/ns/ldp#Container", "http://www.w3.org/ns/ldp#DirectContainer", "http://www.jcp.org/jcr/nt/1.0folder", "http://www.jcp.org/jcr/nt/1.0hierarchyNode", "http://www.jcp.org/jcr/nt/1.0base", "http://www.jcp.org/jcr/mix/1.0created", "http://www.w3.org/ns/oa#Annotation", "http://fedora.info/definitions/v4/rest-api#resource", "http://fedora.info/definitions/v4/rest-api#object", "http://fedora.info/definitions/v4/rest-api#relations", "http://www.jcp.org/jcr/mix/1.0lastModified", "http://www.jcp.org/jcr/mix/1.0lockable", "http://www.jcp.org/jcr/mix/1.0referenceable", "http://purl.org/dc/elements/1.1/describable"],
                "http://purl.org/dc/elements/1.1/format": [{
                        "@value": "text/html"
                    }],
                "http://purl.org/dc/elements/1.1/language": [{
                        "@value": "de"
                    }],
                "http://purl.org/dc/elements/1.1/title": [{
                        "@value": $scope.ctitle
                    }],
                "http://www.w3.org/2011/content#characterEncoding": [{
                        "@value": "utf-8"
                    }],
                "http://www.w3.org/2011/content#chars": [{
                        "@value": $scope.ctext
                    }]

            }];
        $http({
            method: 'PUT',
            url: $scope.childurl,
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
         });
         **/

        $route.reload();
        $window.location.reload();
        //$scope.$apply( $location.path( url ) );


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


// $modalInstance represents a modal window (instance) dependency.


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



