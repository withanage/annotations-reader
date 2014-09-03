var app = angular.module('plunker', []);

app.directive('annotorious', function() {
  return {
    restrict : 'A',
    link : function(scope, element) {
      anno.makeAnnotatable(element[0]);
    }
  };
});
