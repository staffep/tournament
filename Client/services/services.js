angular.module('myApp.service', []);

myApp.service('_tournament', ['$http', 'globalVars', function ($http, globalVars) {
    this.post = function (settings, callback) {
        $http({
                method: 'POST',
                url: 'http://nhltournament.azurewebsites.net/tournament',
                //url: 'http://localhost:3000/tournament',
                headers: { 'Content-Type': 'application/json' },
                data: settings
            })
            .success(function (data) {
                window.history.pushState("", "", "" + "tournamentmode?ID=" + data._id);
                callback(data);
            });
    }

    this.get = function (id, callback) {
        $http({
                method: 'GET',
                url: 'http://nhltournament.azurewebsites.net/tournament/' + id,
                //url: 'http://localhost:3000/tournament/' + id,
                async: false,
                headers: { 'Content-Type': 'application/json' }
            })
            .success(function (data) {
                
                callback(data);
            });
    }

    this.update = function (id, homeTeam, awayTeam, callback) {
        this.settings = globalVars.settings;

        let index = 0;
        globalVars.settings.players.forEach(function (player) {
            if (player.playername === homeTeam.playername) {
                this.settings.players[index] = homeTeam;
            } else if (player.playername === awayTeam.playername) {
                this.settings.players[index] = awayTeam;
            }
            index++;
        }, this);

        $http({
                method: 'PUT',
                url: 'http://nhltournament.azurewebsites.net/tournament/' + globalVars.settings.tournamentId.toString(),
                //url: 'http://localhost:3000/tournament/' + globalVars.settings.tournamentId.toString(),
                data: globalVars.settings,
                async: false,
                headers: { 'Content-Type': 'application/json' }
            })
            .success(function (data) {

                callback(data);
            })
            .error(function(e)
        {
            console.log(e);
        });
    }

    this.updateBracket = function (id, bracket, callback) {
        globalVars.settings.bracket = angular.toJson(bracket);
        $http({
                method: 'PUT',
                url: 'http://nhltournament.azurewebsites.net/tournament/' + globalVars.settings.tournamentId.toString(),
                //url: 'http://localhost:3000/tournament/' + globalVars.settings.tournamentId.toString(),
                data: globalVars.settings,
                async: false,
                headers: { 'Content-Type': 'application/json' }
            })
            .success(function (data) {

                callback(data);
            })
            .error(function (e) {
                console.log(e);
            });
    }

    this.getAll = function (callback) {
        $http({
                method: 'GET',
                url: 'http://nhltournament.azurewebsites.net/tournament',
                //url: 'http://localhost:3000/tournament',
                headers: { 'Content-Type': 'application/json' }
            })
            .success(function (data) {
                callback(data);
            });
    }

}]);
