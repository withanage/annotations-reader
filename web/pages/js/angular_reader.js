// create the module and name it readerApp
var readerApp = angular.module('readerApp', ['ngRoute']);

// configure our routes
/**
 readerApp.config(function($routeProvider) {
 $routeProvider
 
 // route for the home page
 .when('/', {
 templateUrl: 'index.html',
 controller: 'mainController'
 })
 
 // route for the about page
 .when('/about', {
 templateUrl: '/about.html',
 controller: 'aboutController'
 })
 
 // route for the contact page
 .when('/contact', {
 templateUrl: 'pages/contact.html',
 controller: 'contactController'
 });
 });
 **/
// create the controller and inject Angular's $scope
readerApp.controller('mainController', function($scope, fedoraService) {
    $scope.message = 'Everyone come and see how good I look!';
    var url = 'http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/fcr:export';
    var x2js = new X2JS();
    fedoraService.fetch(url).then(function(data) {
        $scope.comments = x2js.xml_str2json(data.data);
        //console.log($scope.comments);
    });



    //
    $scope.vm = {};
    $scope.vm.chapter = {
        "Id": "N7313",
        "Title": "1 Chapter1",
        "Content": "<p>Contents1</p>",
        "Paragraphs": [
            {
                "Id": "N1.1",
                "Title": "1.1 Paragraph1.1",
                "Content": "<p>Content2</p>",
                "Paragraphs": [
                    {
                        "Id": "N1.1.1",
                        "Title": "1.1.1 Paragraph1.1.1",
                        "Content": "<p>ContentA</p>",
                        "Paragraphs": []
                    },
                    {
                        "Id": "N1.1.2",
                        "Title": "1.1.2 Paragraph1.1.2",
                        "Content": "<p>ContentB.</p>",
                        "Paragraphs": []
                    }
                ]
            },
            {
                "Id": "N1.2",
                "Title": "1.2 Paragraph1.2",
                "Content": "<p>Content3.</p>",
                "Paragraphs": []
            },
            {
                "Id": "N1.1.2",
                "Title": "1.1.2 Paragraph1.1.2",
                "Content": "<p>ContentB.</p>",
                "Paragraphs": []
            }

        ]
    };

    //**


});

readerApp.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

readerApp.controller('contactController', function($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});


readerApp.factory('fedoraService', function($http) {
    var fetch = function(url) {
        return $http({
            method: 'get',
            url: url,
        });
        //console.log('xhr called ' + url);
    };

    return {
        fetch: fetch
    };
});
