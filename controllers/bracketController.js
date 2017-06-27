'use strict';


var mongoose = require('mongoose'),
    Bracket = mongoose.model('Bracket');

exports.list_all_brackets = function (req, res) {
    Bracket.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create_a_bracket = function (req, res) {
    var new_bracket = new Bracket(req.body);
    new_bracket.save(function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.read_a_bracket = function (req, res) {
    Bracket.findById(req.params.bracketId, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.update_a_bracket = function (req, res) {
    Bracket.findOneAndUpdate({ "bracketId": req.body.bracketId }, req.body, { new: true, upsert: true }, function (err, task) {
        if (err)
            res.send(err);
        console.log(err);
        res.json(task);
        console.log(task)
    });
};


exports.delete_a_bracket = function (req, res) {


    Bracket.remove({
        _id: req.params.tournamentId
    }, function (err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};

