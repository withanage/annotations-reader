/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var readerAppControllers = angular.module('readerAppControllers', []);
readerAppControllers.controller('MainCtrl', function($scope, fedoraServiceJSON, fedoraServiceXML, $modal, $log, $http, $window, $route, $location, generateUUID, $q) {
    $scope.oneAtATime = true;
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
    var prefix = 'fedora/rest';
    var collection = $location.$$path;
    var server_port = 8080;//$location.$$port
    //http://pers31.ub.uni-heidelberg.de:8080/annotations-reader/index.html#/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/
    var url = $location.$$protocol + "://" + $location.$$host + ':' + server_port + '/' + prefix + '' + collection;
    //var new_id = Math.floor(Math.random() * 1000000000000000000000);

    //console.log("url", url);
    //console.log("location", $location);





    $scope.comments = [];
    $scope.child = [];

    fedoraServiceJSON.fetch(url).then(function(data) {

        if (data['@graph'] != null) {
            var annos = data['@graph'].splice(1, data['@graph'].length - 1);

            angular.forEach(annos, function(value) {
                var temp = [];
                $http.get(value['@id'] + '/fcr:export').success(function(data) {
                    var x2js = new X2JS();
                    var d = x2js.xml_str2json(data);
                    //temp = [];
                    temp.pop();
                    temp.push(d);
                    //console.log(JSON.stringify(d));

                })

                console.log(temp);
                var tuple = {'title': value['dc:title'],
                    'uuid': value['fcrepo:#uuid'],
                    'url': value['@id'],
                    'text': value['dc:description'],
                    'date': value['fcrepo:#created'],
                    'name': value['fcrepo:#createdBy'],
                    'profileUrl': 'http://dummyimage.com/40x40&text=' + value['fcrepo:#createdBy'],
                    'annotations': temp

                }

                $scope.comments.push(tuple);



                //$scope.tmp = [];
            });
        }


        //console.log($scope.comments);
        sort_text = 'date';
        $scope.comments.sort(function(a, b) {
            if (a[sort_text] < b[sort_text])
                return 1;
            if (a[sort_text] > b[sort_text])
                return -1;
            return 0;
        })
        $scope.comments = $scope.comments.sort();
        //console.log($scope.comments);

        $scope.add = function(data) {
            var post = data.nodes.length + 1;
            var newName = data.name + '-' + post;
            data.nodes.push({name: newName, nodes: []});
        };
        $scope.tree = [{name: "Node", nodes: []}];
    });
    //form
    $scope.submit = function(id) {

        if (id == null) {
            $scope.childurl = url + generateUUID; //''+ Math.floor(Math.random() * 10000000000000000);
            $scope.title = this.title;
            $scope.text = this.text;
        }
        else {
            $scope.childurl = id + '/' + generateUUID;
            $scope.title = this.title;
            $scope.text = this.text;
        }
        console.log($scope.childurl);
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
                        "@value": $scope.title
                    }],
                "http://www.w3.org/2011/content#characterEncoding": [{
                        "@value": "utf-8"
                    }],
                "http://purl.org/dc/elements/1.1/description": [{
                        "@value": $scope.text
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
        fedoraServiceJSON.fetch(url).then(function(data) {
        });
        $route.reload();
        $window.location.reload();
        //$scope.$apply( $location.path(url) );


    };
    $scope.tags = [];
    $scope.getdata = function(url, values) {

        angular.forEach(values, function(value, key) {
            //console.log(value['@id']);
            fetchfedoraJSON.fetch(value['@id']).then(function(data) {
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
        if ((words.length == 1) && (words[0] === '')) {      //
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



