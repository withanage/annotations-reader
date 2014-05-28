/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */

function Reader($scope, $http) {
    $http.get('../../fedora/rest/test/fcr:transform/default').
        success(function(data) {
            $scope.annotation = data;
        });
}


