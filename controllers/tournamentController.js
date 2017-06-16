'use strict';


var mongoose = require('mongoose'),
    Tournament = mongoose.model('Tournament');

exports.list_all_tournament = function (req, res) {
    Tournament.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create_a_tournament = function (req, res) {
    var new_task = new Tournament(req.body);
    new_task.save(function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.read_a_tournament = function (req, res) {
    Tournament.findById(req.params.tournamentId, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.update_a_tournament = function (req, res) {
    Tournament.findOneAndUpdate(req.params.tournamentId, req.body, { new: true }, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.delete_a_tournament = function (req, res) {


    Tournament.remove({
        _id: req.params.tournamentId
    }, function (err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Task successfully deleted' });
    });
};

