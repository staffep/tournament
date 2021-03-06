﻿'use strict';
module.exports = function (app) {
    var tournament = require('../controllers/tournamentController');
    //var bracket = require('../controllers/bracketController');


    // tournament Routes
    app.route('/tournament')
        .get(tournament.list_all_tournament)
        .post(tournament.create_a_tournament);


    app.route('/tournament/:tournamentId')
        .get(tournament.read_a_tournament)
        .put(tournament.update_a_tournament)
        .delete(tournament.delete_a_tournament);

    ////bracket routes
    //app.route('/bracket')
    //    .get(bracket.list_all_brackets)
    //    .post(bracket.create_a_bracket);

    //app.route('/bracket/:bracketId')
    //    .get(bracket.read_a_bracket)
    //    .put(bracket.update_a_bracket)
    //    .delete(bracket.delete_a_bracket);

    

};
