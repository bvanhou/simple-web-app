function config($routeProvider, $stateProvider, $urlRouterProvider, $locationProvider, envServiceProvider, $interpolateProvider, $httpProvider, routes) {

  // Loop over route objects in routes constant
  for(var state in routes) {
      // Configure routeProvider based on routes constant
      $stateProvider.state(state, routes[state]);
  }

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  // set the domains and variables for each environment
  envServiceProvider.config({
    domains: {
      development: ['localhost'],
      qa: ['securityresearch.us'],
      production: ['securityresearch.us']
      // anotherStage: ['domain1', 'domain2']
    },
    vars: {
      development: {
        apiUrl: 'https://dev-api.hopspot.com',
        // staticUrl: '//localhost/static'
      },
      qa: {
        apiUrl: 'https://qa-api.hopspot.com',
        // staticUrl: '//localhost/static'
      },
      production: {
        apiUrl: 'https://api.hopspot.com',
        // staticUrl: '//static.acme.com'
      }
    }
  });

  // run the environment check, so the comprobation is made
  // before controllers and services are built
  envServiceProvider.check();

  //$httpProvider.interceptors.push('authInterceptor');

}

module.exports = config;
