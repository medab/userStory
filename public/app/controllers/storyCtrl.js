angular.module("storyCtrl",['stroyService'])

.controller("StoryController", function(Story,socketio){

 	var vm = this;

    Story.all()
    	.success(function(data){
    		vm.stories=data;
    	});

    vm.createStroy = function(){

    	vm.message='';

    	Story.create(vm.storyData)
    		.success(function(data){
    			vm.storyData = {};
    			vm.message = data.message;
    		});			
    };

    socketio.on('story', function(data){
    	vm.stories.push(data);
    })


    	
});
