﻿'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BracketSchema = new Schema({
    bracketId: {
        type: Number
    },
    json: {
        type: String
    }
});

module.exports = mongoose.model('Bracket', BracketSchema);