var mongoose = require('mongoose');

var Contact = mongoose.model('Contact', {
    type:   {type : String, default: ''},
    name:   {type : String, default: ''},
    title:  {type : String, default: ''},
    phone:  {type : String, default: ''},
    ext:    {type : String, default: ''},
    fax:    {type : String, default: ''},
    email:  {type : String, default: ''}
});

module.exports = Contact;
