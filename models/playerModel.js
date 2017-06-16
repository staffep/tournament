'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
    playername: { type: String},
    team: { type: String}
});

module.exports = mongoose.model('Player', playerSchema);