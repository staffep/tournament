'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    playername: { type: String},
    team: { type: String },
    gamesplayed: { type: Number },
    wins: { type: Number },
    losses: { type: Number },
    draws: { type: Number },
    goalsForward: { type: Number },
    goalsAgainst: { type: Number },
    plusminus: { type: Number },
    points: { type: Number },
});

var TournamentSchema = new Schema({
    Created_date: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    players: {
        type: [PlayerSchema],
        default: [{ playername: "Staffan", team: "dif" }, { playername: "Hampus", team: "aik" }]
    },
    doubleMeeting: {
        type: Boolean
    },
    playoff: {
        type: Boolean
    },
    teamsToPlayoff: {
        type: Number
    },
    gamesForEachPlayer: {
        type: Number
    }
});

module.exports = mongoose.model('Tournament', TournamentSchema);