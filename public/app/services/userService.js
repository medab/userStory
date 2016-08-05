angular.module("userService",[])

.factory("User", function($http,$q,$window){


	var userFactory = {};

	userFactory.all = function(){
		return $http.get("/myapp/users");
	}
    
    userFactory.create = function(userData){

    return $http.post("/myapp/signup",userData);

    }

    return userFactory;

});