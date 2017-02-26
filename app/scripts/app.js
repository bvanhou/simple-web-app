// Controllers
import MainController from './controllers/main-controller.js';

// Service
import ContactsService from './services/contacts-service.js';

// Create app and assign modules
angular.module('project', ['ui.router'])

        // config routes
        .config(function($stateProvider, $urlRouterProvider) {

              $urlRouterProvider.otherwise('/');

              $stateProvider
                  .state('main', {
                      url: '/',
                      templateUrl: '../views/main.html',
                      controller: 'MainController',
                      controllerAs: 'main'
                  })
          })

        // Controllers
        .controller('MainController', MainController)

        // Service
        .service('ContactsService', ContactsService)
