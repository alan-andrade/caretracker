var mongoose = require('mongoose')
  , Event = mongoose.model('Event');
exports.events = function (req, res) {
  // TODO: Scope by current user access
  Event.find({user_id: {$in: req.user.canAccess()}}, function(error, events){
    if(error) return res.json(false);
    res.json({events: events});
  });
};

exports.event = function (req, res) {
  // TODO: Scope by current user access
  Event.findById(req.params.id, function(error, event){
    if(error) return res.json(false);
    res.json({event: event});
  });
};

// POST

exports.eventAdd = function (req, res) {
  // TODO: Scope by current user access
  Event.create(req.body, function(error, event){
    if(error) return res.json(false);
    res.json({event: event});
  });
};

// PUT

exports.eventEdit = function (req, res) {
  // TODO: Scope by current user access
  Event.findById(req.params.id, function(error, event){
    if(error) return res.json(false);
    if(req.body.completed){
      event.completed_at = Date.now();
      event.completed_by = req.user.id;
    }
    event.name = req.body.name;
    event.save(function(error){
      if(error) return res.json({error: error});
      res.json({event: event});
    });
  });
};

// DELETE

exports.eventDelete = function (req, res) {
  // TODO: Scope by current user access
  Event.findByIdAndRemove(req.params.id, function(error, event){
    if(error) return res.json(false);
    res.json(true);
  });
};