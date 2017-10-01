var app = angular.module('restaurant', ['ngRoute', 'myService', 'myController', 'myDirective', 'ngCookies','ngFileUpload']);
//route->get different page
app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			controller: 'homeCtrl',
			templateUrl: '/template/home.html'
		})
		.when('/menu', {
			controller: 'menuCtrl',
			templateUrl: '/template/menu.html'
		})
		.when('/menu-items', {
			controller: 'menuItems',
			templateUrl: '/template/menu-items.html'
		})
		.when('/add-category', {
			controller: 'addCategory',
			templateUrl: '/template/add-category.html'
		})
		.when('/add-menu', {
			controller: 'addMenu',
			templateUrl: '/template/add-Menu.html'
		})
		.when('/about', {
			controller: 'homeCtrl',
			templateUrl: '/template/about.html'
		})
		.when('/awards', {
			controller: 'homeCtrl',
			templateUrl: '/template/awards.html'
		})
		.when('/blog', {
			controller: 'postCtrl',
			templateUrl: '/template/listPost.html'
		})
		.when('/signup', {
			controller: 'registCtrl',
			templateUrl: '/template/signup.html'
		})
		.when('/signin', {
			controller: 'signinCtrl',
			templateUrl: '/template/signin.html'
		})
		.when('/myblog', {
			controller: 'myblogCtrl',
			templateUrl: '/template/myblog.html'
		})
		.when('/nosignin', {
			controller: 'noSigninCtrl',
			templateUrl: '/template/noSignin.html'
		})
		.when('/writePost', {
			controller: 'writeBlogCtrl',
			templateUrl: '/template/writePost.html'
		})
		.when('/detailPost', {
			controller: 'detailCtrl',
			templateUrl: '/template/postDetail.html'
		})
		.otherwise({
			redirectTo: '/'
		});
});


