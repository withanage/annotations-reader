'use strict';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */


var readerApp = angular.module('readerApp',
        ['ui.bootstrap',
            'ngTouch',
            'readerAppControllers',
            'readerAppServices',
            'readerAppFilters',
            'ngRoute'
        ])

       




/**
 readerAppServices.config(['$httpProvider', function($httpProvider) {
 $httpProvider.interceptors.push('requestRejector');
 // Removing 'requestRecoverer' will result to failed request
 $httpProvider.interceptors.push('requestRecoverer');
 }]);
 **/
/**
 var count = 1;
 readerApp.config(function($routeProvider){
 
 $routeProvider
 .when("/",{
 template:"<h1>root {{count}}</h1>",
 controller: function($scope){
 $scope.count = count++;
 }
 })
 .when("/other",{
 template:"<h1>other</h1>" 
 });
 });
 
 readerApp.directive('xref',function($route, $location){
 return {
 link: function(scope, elm,attr){
 elm.on('click',function(){
 if ( $location.path() === attr.xref ) {
 $route.reload();
 } else {
 scope.$apply(function(){
 $location.path(attr.xref);
 });
 }
 
 
 });
 }
 };
 });
 **/