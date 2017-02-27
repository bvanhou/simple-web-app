var Contact = require('../app/scripts/models/contact.js');

module.exports = function(app) {

  app.get('/contacts', function(req, res) {
      // use mongoose to get all contacts in the database
      Contact.find(function(err, contacts) {
        if (err)
              res.send(err);

          res.json(contacts); // return all contacts in JSON format
      });
  });

  app.post('/contacts', function(req, res) {
      // use mongoose to get all contacts in the databas
      Contact.create(req.body, function (err) {
        if (err)
             res.send(err);
      });
  });

  app.delete('/contacts/:id', function(req, res) {
      // use mongoose to get all contacts in the database
      console.log('Deleting Message');
      console.log(req.params.id);
      Contact.remove({'_id':req.params.id}, function(err) {
        if (err)
              res.send(err);
      });
  });

};
