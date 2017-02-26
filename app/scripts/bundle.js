(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _mainController = require('./controllers/main-controller.js');

var _mainController2 = _interopRequireDefault(_mainController);

var _contactsService = require('./services/contacts-service.js');

var _contactsService2 = _interopRequireDefault(_contactsService);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

// Create app and assign modules
// Controllers
angular.module('project', ['ui.router'])

// config routes
.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('main', {
        url: '/',
        templateUrl: '../views/main.html',
        controller: 'MainController',
        controllerAs: 'main'
    });
}])

// Controllers
.controller('MainController', _mainController2.default)

// Service
.service('ContactsService', _contactsService2.default);

// Service

},{"./controllers/main-controller.js":2,"./services/contacts-service.js":3}],2:[function(require,module,exports){
'use strict';

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var MainController = function () {
  /* @ngInject */
  MainController.$inject = ["ContactsService", "$q"];
  function MainController(ContactsService, $q) {
    _classCallCheck(this, MainController);

    angular.extend(this, {
      service: ContactsService,
      $q: $q,
      title: 'External Contacts',
      summation: 'Select the client contacts associated with this offer',

      // Headers
      headers: [{ title: '' }, { title: 'Type' }, { title: 'Name' }, { title: 'Title' }, { title: 'Phone' }, { title: 'Ext.' }, { title: 'Fax' }, { title: 'Email' }],

      // Contacts
      contacts: [],
      newItem: false

    });

    this.list();
  }

  _createClass(MainController, [{
    key: 'list',
    value: function list() {
      var _this = this;

      return this.service.get().then(function (response) {
        if (Array.isArray(response.data)) _this.contacts = response.data;
      });
    }
  }, {
    key: 'sort',
    value: function sort(key) {
      var _key = key.toLowerCase();
      this.contacts.sort(function (a, b) {
        var nameA = a[_key],
            nameB = b[_key];
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      });
    }
  }, {
    key: 'insert',
    value: function insert() {
      this.newItem = true;
      this.contacts.push({ 'create': true });
      //this.contacts[this.contacts.length].create = true;
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var contact = this.contacts.find(function (d) {
        return d.selected === true;
      });

      if (contact != null) {
        var index = this.contacts.findIndex(function (x) {
          return x.selected == true;
        });
        this.contacts.splice(index, 1);
        this.service.remove(contact);
      }
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.newItem = false;
      this.contacts.splice(this.contacts.length - 1, 1);
    }
  }, {
    key: 'save',
    value: function save(contact) {
      this.newItem = false;
      delete contact['create'];
      this.service.create(contact);
    }
  }]);

  return MainController;
}();

;

module.exports = MainController;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var ContactsService = function () {
  /* @ngInject */
  ContactsService.$inject = ["$http", "$q"];
  function ContactsService($http, $q) {
    _classCallCheck(this, ContactsService);

    angular.extend(this, {
      $http: $http,
      $q: $q
    });
  }

  _createClass(ContactsService, [{
    key: 'get',
    value: function get() {
      return this.$http.get('http://localhost:8080/contacts');
    }
  }, {
    key: 'create',
    value: function create(data) {
      console.log('Send to Create Service');
      console.log(data);
      return this.$http.post('http://localhost:8080/contacts', data);
    }
  }, {
    key: 'remove',
    value: function remove(data) {
      console.log('Send to Delete Service');
      console.log(data);
      return this.$http.delete('http://localhost:8080/contacts', data);
    }
  }]);

  return ContactsService;
}();

;

module.exports = ContactsService;

},{}]},{},[1])

//# sourceMappingURL=../../maps/bundle.js.map
