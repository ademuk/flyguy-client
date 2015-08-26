"use strict";angular.module("flyguyApp",["ngAria","ngTouch","restangular","ui.router","angular-jwt"]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("flights",{url:"/flights",templateUrl:"views/flights.html",controller:"FlightsCtrl"}).state("flight",{url:"/flight/:id",templateUrl:"views/flight.html",controller:"FlightCtrl"}).state("log",{url:"/log",templateUrl:"views/log.html",controller:"LogCtrl"}).state("register",{url:"/register",templateUrl:"views/register.html",controller:"RegisterCtrl"}).state("login",{url:"/login",templateUrl:"views/login.html",controller:"LoginCtrl"}).state("logout",{url:"/login",templateUrl:"views/logout.html",controller:"LogoutCtrl"}),b.otherwise("/flights")}]);var baseUrl="http://127.0.0.1:8000/api/";angular.module("flyguyApp").constant("config",{baseUrl:baseUrl}),angular.module("flyguyApp").config(["RestangularProvider","jwtInterceptorProvider","$httpProvider","config",function(a,b,c,d){a.setBaseUrl(d.baseUrl),a.setRequestSuffix("/"),a.addResponseInterceptor(function(a,b){return"getList"===b&&(a=a.results),a}),b.authPrefix="JWT ",b.tokenGetter=["Session",function(a){return a.token}],c.interceptors.push("jwtInterceptor")}]),angular.module("flyguyApp").service("User",["config","$http",function(a,b){function c(){}return c.prototype.create=function(c){return b.post(a.baseUrl+"users/",c).then(this._onCreate.bind(this))},c.prototype._onCreate=function(a){return a.data},new c}]),angular.module("flyguyApp").factory("Session",["config","$http",function(a,b){function c(){localStorage.getItem("sessionToken")&&this._setToken(localStorage.getItem("sessionToken"))}return c.prototype={create:function(c){return b.post(a.baseUrl+"token-auth/",c).then(this._onCreate.bind(this))},destroy:function(){this._setToken(null)},exists:function(){return!!this.token},_setToken:function(a){this.token=a,a?localStorage.setItem("sessionToken",a):localStorage.removeItem("sessionToken")},_onCreate:function(a){return this._setToken(a.data.token),a.data}},new c}]),angular.module("flyguyApp").factory("Flights",["Restangular",function(a){return a.service("flights")}]),angular.module("flyguyApp").controller("NavCtrl",["$scope","$location","Session",function(a,b,c){a.session=c,a.logOut=function(){c.destroy(),b.path("/login")}}]),angular.module("flyguyApp").controller("FlightsCtrl",["$scope","Flights","Session",function(a,b,c){a.flights=[],a.loadFlights=function(){b.getList().then(function(b){a.flights=b})},c.exists()&&a.loadFlights()}]),angular.module("flyguyApp").controller("FlightCtrl",["$scope","$stateParams","Flights",function(a,b,c){a.loadFlight=function(){c.one(b.id).get().then(function(b){a.flight=b})},a.loadFlight()}]),angular.module("flyguyApp").controller("LogCtrl",["$scope","$location","$filter","Flights","Session",function(a,b,c,d,e){a.session=e.exists(),a.submitForm=function(a,e){var f;a&&(f=angular.copy(e),f.date=c("date")(f.date,"yyyy-MM-dd"),d.post(f).then(function(){b.path("/flights")}))}}]),angular.module("flyguyApp").controller("LoginCtrl",["$scope","$location","Session",function(a,b,c){a.submitForm=function(d,e){return d?a.hasAccount?void c.create(e).then(function(){b.path("/flights")}):void b.path("/register").search({email:e.email}):void 0}}]),angular.module("flyguyApp").controller("RegisterCtrl",["$scope","$location","User",function(a,b,c){a.user={email:b.search().email||""},a.submitForm=function(a,d){var e;d.password===d.confirmPassword&&(e=angular.copy(d),delete e.confirmPassword,c.create(e).then(function(){b.path("/login")}))}}]);