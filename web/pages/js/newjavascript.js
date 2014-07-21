angular.module('APP', [])

        .directive('collection', function() {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    collection: '='
                },
                template: "<div><member ng-repeat='member in collection' member='member'></member></div>"
            };
        })

        .directive('member', function($compile) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    member: '='
                },
                template: "  <div class='panel panel-default'><div class='panel-heading'>{{member.property[0]}}</div><div class='panel-body'>{{member.property}}</div></div>",
                link: function(scope, element, attrs) {
                    if (angular.isArray(scope.member.node)) {
                        element.append("<collection collection='member.node'></collection>");
                        $compile(element.contents())(scope);
                    }
                }
            };
        })


        .factory('fedoraService', function($http) {
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
        })


        .controller('IndexCtrl', function($scope, fedoraService) {


            var url = 'http://pers31.ub.uni-heidelberg.de:8080/fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/fcr:export';
            var x2js = new X2JS();
            $scope.tasks = [];
            var values = [];
            fedoraService.fetch(url).then(function(data) {
                $scope.tasks = x2js.xml_str2json(data.data);

                console.log(JSON.stringify($scope.tasks));
            });


            $scope.task = [
                {
                    property: 'Europe',
                    node: [
                        {
                            property: 'Italy',
                            node: [
                                {
                                    property: 'Rome'
                                },
                                {
                                    property: 'Milan'
                                }
                            ]
                        },
                        {
                            property: 'Spain',
                            node: [
                                {
                                    property: 'barcelona'
                                },
                                {
                                    property: 'valencia',
                                    node: [
                                        {
                                            property: 'v1'
                                        },
                                        {
                                            property: 'v2'
                                        }
                                    ]
                                }
                            ]

                        }
                    ]
                },
                {
                    property: 'South America',
                    node: [
                        {
                            property: 'Brasil'
                        },
                        {
                            property: 'Peru'
                        }
                    ]
                }
            ];
        });