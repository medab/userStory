 angular.module('Myapp',['appRouters','mainCtrl','authService','userCtrl','userService','storyCtrl','stroyService'])

 .config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})