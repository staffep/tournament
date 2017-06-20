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
    points: { type: Number }
});

var GameSchema = new Schema({
    awayGoals: { type: Number },
    homeGoals: { type: Number },
    round: { type: Number },
    gameNr: { type: Number },
    awayTeam: {
        playername: { type: String },
        team: { type: String },
        gamesplayed: { type: Number },
        wins: { type: Number },
        losses: { type: Number },
        draws: { type: Number },
        goalsForward: { type: Number },
        goalsAgainst: { type: Number },
        plusminus: { type: Number },
        points: { type: Number }
    },
    homeTeam: {
        playername: { type: String },
        team: { type: String },
        gamesplayed: { type: Number },
        wins: { type: Number },
        losses: { type: Number },
        draws: { type: Number },
        goalsForward: { type: Number },
        goalsAgainst: { type: Number },
        plusminus: { type: Number },
        points: { type: Number }
    },
    gamePlayed: {type: Boolean}
});

var TournamentSchema = new Schema({
    Created_date: {
        type: Date,
        default: Date.now
    },
    tournamentId: {
        type: Number
    },
    name: {
        type: String
    },
    players: {
        type: [PlayerSchema]
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
    games: {
        type: [GameSchema]
    },
    gamesForEachPlayer: {
        type: Number
    }
});

module.exports = mongoose.model('Tournament', TournamentSchema);