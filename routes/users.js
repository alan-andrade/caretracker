var User = require('./../models').users;

exports.account = function(req, res) {
  res.render('account', { user: req.user });
};

exports.admin = function(req, res) {
  res.send('access granted admin!');
};

exports.new = function(req, res) {
  res.render('signup', { user: new User(), message: req.session.messages });
};

exports.create = function (req, res, next) {
  var user = new User(
    { name: req.body.name
    , email: req.body.email
    , password: req.body.password
    , passwordConfirmation: req.body.passwordConfirmation
  });
  user.save(function(error){
    if(error){
      console.log(error);
      return res.render('signup', {user: user, message: error.code == 11000 ? "You already have an account" : error.message });
    }
    req.login(user, function(error){
      if(error) return next(error);
      // TODO: Redirect to initial route
      res.redirect('/');
    });
  });
};