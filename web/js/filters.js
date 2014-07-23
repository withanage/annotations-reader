/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var readerAppFilters = angular.module('readerAppFilters', []);
readerAppFilters.filter('fromNow', function() {
    return function(date) {
        return moment(date).fromNow();
    }
})