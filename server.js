// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var cors           = require('cors');
var Contact        = require('./app/scripts/models/contact.js');

// configuration ===========================================

var db = require('./db/config');
var port = process.env.PORT || 8080;

mongoose.connect(db.url);

mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!');
  console.log(err);
});

mongoose.connection.collections['contacts'].drop( function(err) {
    console.log('contacts dropped');
});

//enable cors
app.use(cors());

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./db/routes')(app); // configure routes

// start app ===============================================
// startup app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Starting Server on  ' + port);
console.log('Adding initial Contacts');

Contact.count({}, function( err, count){
    if(count == 0){
      var listOfContacts = [
        {
          type: 'Executive',
          name: 'Ann Brown',
          title: 'CEO',
          phone: '(512) 416-5555',
          ext: '',
          fax:'(512) 416-5555',
          email:'Executive'
        },
        {
          type: 'Inmar AR',
          name: 'Mary Smith',
          title: 'Lorem Ipsum',
          phone: '(512) 416-5555',
          ext: '',
          fax:'(512) 416-5555',
          email:'Inmar AR'
        },
        {
          type: 'Executive',
          name: 'John Doe',
          title: 'Dolor Sit',
          phone: '(512) 416-5555',
          ext: '',
          fax:'(512) 416-5555',
          email:'Executive'
        },
        {
          type: 'Daily',
          name: 'John Doe',
          title: 'Dolor sit amet',
          phone: '(512) 416-5555',
          ext: '',
          fax:'(512) 416-5555',
          email:'Daily'
        },
        {
          type: 'Other',
          name: 'John Doe',
          title: 'Lorem Ipsum',
          phone: '(512) 416-5555',
          ext: '',
          fax:'(512) 416-5555',
          email:'Other'
        },
      ];

      listOfContacts.forEach(function(element) {
          var user = new Contact(element);
          user.save(function (err) {if (err) console.log ('Error on save!')});
      });
    }
});

// expose app
exports = module.exports = app;
