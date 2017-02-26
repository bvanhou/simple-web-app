class ContactsService {
  /* @ngInject */
  constructor($http, $q) {

    angular.extend(this, {
      $http:$http,
      $q:$q
    });
  }

  get() {
    return this.$http.get('http://localhost:8080/contacts');

  }

  create(data) {
    console.log('Send to Create Service');
    console.log(data);
    return this.$http.post('http://localhost:8080/contacts', data);
  }

  remove(data) {
    console.log('Send to Delete Service');
    console.log(data);
    return this.$http.delete('http://localhost:8080/contacts', data);
  }

};

module.exports = ContactsService;
