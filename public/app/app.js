 angular.module('Myapp',['appRouters','mainCtrl','authService','userCtrl','userService','storyCtrl','stroyService','reverseDirective'])

 .config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})