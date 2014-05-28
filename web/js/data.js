/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */

function Hello($scope, $http) {
    $http.get('http://serv21.ub.uni-heidelberg.de:8080/annotations/rest/test/fcr:transform/default').
        success(function(data) {
            $scope.greeting = data;
        });
}


