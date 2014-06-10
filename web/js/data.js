/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */

function Reader($scope, $http) {
    var folder = '../../';
    var uuid = 'fedora/rest/de/uni-heidelberg/ub/digi/diglit/lehmann1756/0001/';
    var template ='default3';
    $http.get(folder + uuid+ 'fcr:transform/'+template).
            success(function(data) {
                $scope.annotation = data;
            });
}



