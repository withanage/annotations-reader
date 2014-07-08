/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var readerAppControllers = angular.module('readerAppControllers', []);
readerAppControllers.controller('MainCtrl', function($scope, fetchfedora, $modal, $log) {
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