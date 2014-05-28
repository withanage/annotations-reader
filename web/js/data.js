/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */

function Reader($scope, $http) {
    var folder = '../../';
    var uuid = 'fedora/rest/test/97/9c/9f/bc/979c9fbc-94f7-4bcb-aae4-2b4737024113/';
    var template ='default1';
    $http.get(folder + uuid+ 'fcr:transform/'+template).
            success(function(data) {
                $scope.annotation = data;
            });
}


