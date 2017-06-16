'use strict';
module.exports = function (app) {
    var tournament = require('../controllers/tournamentController');


    // tournament Routes
    app.route('/tournament')
        .get(tournament.list_all_tournament)
        .post(tournament.create_a_tournament);


    app.route('/tournament/:tournamentId')
        .get(tournament.read_a_tournament)
        .put(tournament.update_a_tournament)
        .delete(tournament.delete_a_tournament);
};
