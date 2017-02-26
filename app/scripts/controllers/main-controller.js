class MainController {
  /* @ngInject */
  constructor(ContactsService, $q) {

    angular.extend(this, {
      service:ContactsService,
      $q:$q,
      title: 'External Contacts',
      summation: 'Select the client contacts associated with this offer',

      // Headers
      headers: [
        {title: ''},
        {title: 'Type'},
        {title: 'Name'},
        {title: 'Title'},
        {title: 'Phone'},
        {title: 'Ext.'},
        {title: 'Fax'},
        {title: 'Email'}
      ],

      // Contacts
      contacts: [],
      newItem: false

    });

    this.list();
  }

  list(){
    return this.service.get()
      .then((response) => {
          if (Array.isArray(response.data))
              this.contacts = response.data;
        });
  }

  sort(key){
    var _key = key.toLowerCase();
    this.contacts.sort((a, b) => {
        var nameA=a[_key], nameB=b[_key];
        if (nameA < nameB) //sort string ascending
            return -1;
        if (nameA > nameB)
            return 1;
        return 0 //default return value (no sorting)
    });
  }

  insert(){
    this.newItem = true;
    this.contacts.push({'create':true});
    //this.contacts[this.contacts.length].create = true;
  }

  delete(){
    var contact = this.contacts.find(function (d) {
        return d.selected === true;
    });

    if(contact != null){
      var index = this.contacts.findIndex(x => x.selected==true);
      this.contacts.splice(index,1);
      this.service.remove(contact);
    }
  }

  cancel(){
    this.newItem = false;
    this.contacts.splice(this.contacts.length-1,1);
  }

  save(contact){
    this.newItem = false;
    delete contact['create'];
    this.service.create(contact);
  }

};

module.exports = MainController;
