angular.module("userCtrl",['userService'])


.controller("UserController",function(User){


	var vm=this;

    User.all()
    	.success(function(data){
    		vm.data=data;
    	})

})

.controller("UserCtreateController",function(User,$location,$window){

	var vm=this;
	vm.processing = true;


	vm.signupUser= function(){
		vm.message='';
		User.create(vm.userData)
			.then(function(response){
				if(response.data.success){
				vm.userData = {};
				vm.message = response.data.message;
				$window.localStorage.setItem('token',response.data.token);
				$location.path('/');
				}else{
				vm.processing = false;
				vm.message = response.data.errmsg;	
				}
				
			})
	}

})