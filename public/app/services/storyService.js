angular.module("stroyService",[])

.factory('Story', function($http) {

   var storyFactory= {};


   storyFactory.all = function(){   
   		return $http.get("/myapp/");
   }

   storyFactory.create= function(storyData){
   	  return $http.post("/myapp/",storyData);
   }

return storyFactory;

})

.factory('socketio', function($rootScope) {

	var socket = io.connect();
	return {

		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}

	};

});