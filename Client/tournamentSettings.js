var myApp = angular.module("tournament", []);

myApp.controller('TournamentController', ['$http', '_tournament', function ($http, _tournament) {
    //this.earlierTournaments = ["test", "test2", "test3"];

    //_tournamentService.earlierTournaments.async().then(function (d) {
    //    this.earlierTournaments = d.data;
    //});

    this.name = "";
    this.qty = 2;
    this.doubleMeeting = false;
    this.playoff = false;
    this.teamsToPlayOff = [];
    this.teamsToPlayoff = function (teamsInGroup) {
        this.possibleTeamsToPlayOff = [1, 2, 4, 8, 16, 32, 64, 128];
        this.teamsToPlayOff = [];
        for (var i = 0; i < this.possibleTeamsToPlayOff.length; i++) {
            if (teamsInGroup >= this.possibleTeamsToPlayOff[i])
                this.teamsToPlayOff.push(this.possibleTeamsToPlayOff[i]);
        }
    }
    this.finalTeamsToPlayOff = 0;
    this.team = '';
    this.players = [];
    this.id = new Date().getUTCMilliseconds();
    this.currentStatus = "uncreated";
    
    this.teams = ['Carolina Hurricanes',
        'Columbus Blue Jackets',
        'New Jersey Devils',
        'New York Islanders',
        'New York Rangers',
        'Philadelphia Flyers',
        'Pittsburgh Penguins',
        'Washington Capitals',
        'Boston Bruins',
        'Buffalo Sabres',
        'Detroit Red Wings',
        'Florida Panthers',
        'Montréal Canadiens',
        'Ottawa Senators',
        'Tampa Bay Lightning',
        'Toronto Maple Leafs',
        'Chicago Blackhawks',
        'Colorado Avalanche',
        'Dallas Stars',
        'Minnesota Wild',
        'Nashville Predators',
        'St.Louis Blues',
        'Winnipeg Jets',
        'Anaheim Ducks',
        'Arizona Coyotes',
        'Calgary Flames',
        'Edmonton Oilers',
        'Los Angeles Kings',
        'San Jose Sharks',
        'Vancouver Canucks',
        'Vegas Golden Knights'];

    this.getNumber = function (num) {
        var playersIds = new Array(num);
        return playersIds;
    }
   
    this.save = function() {
        this.settings = {
            "id": this.id,
            "name": this.name,
            "players": this.players,
            "doubleMeeting": this.doubleMeeting,
            "playoff": this.playoff,
            "teamsToPlayoff": this.finalTeamsToPlayOff,
            "gamesForEachPlayer": this.doubleMeeting === true ? (this.players.length - 1) * 2 : (this.players.length - 1) * 1
        };

        for (var i = 0; i < this.settings.players.length; i++) {
            this.settings.players[i].id = i;
            this.settings.players[i].gamesplayed = 0;
            this.settings.players[i].wins = 0;
            this.settings.players[i].losses = 0;
            this.settings.players[i].draws = 0;
            this.settings.players[i].goalsForward = 0;
            this.settings.players[i].goalsAgainst = 0;
            this.settings.players[i].plusminus = 0;
            this.settings.players[i].points = 0;
            this.settings.players[i].playedGames = {};
            this.settings.players[i].finished = false;
        
        }
        
        //localStorage.setItem("tournamentSettings", this.settings);
        
        this.currentStatus = "created";
        _tournament.post(this.settings);
    }
}]);

myApp.service('_tournament', ['$http', function ($http) {
    
    this.post = function (settings) {
        $http({
                method: 'POST',
                url: 'http://localhost:3000/tournament',
                headers: { 'Content-Type': 'application/json' },
                data: settings
            })
            .success(function (data) {
                window.history.pushState("", "", "" + "?ID=" + data._id);
            });
    }

    this.get = function (id, callback) {
        $http({
                method: 'GET',
                url: 'http://localhost:3000/tournament/' + id,
                async: false,
                headers: { 'Content-Type': 'application/json' }
            })
            .success(function (data) {
                console.log(data);
                callback(data);
            });
    }

}]);

//myApp.service('_tournamentService', function ($http) {

//    console.log("service");
//    //this.initTournament = function (data) {
//    //    this.settings = {};
//    //    this.settings.id = data._id;
//    //    this.settings.name = data.Name;
//    //    this.settings.players = data.players;
//    //    this.settings.doubleMeeting = data.doubleMeeting;
//    //    this.settings.playoff = data.playoff;
//    //    this.settings.playersArr = [];
//    //    this.settings.playerObj = {};

//    //    for (var i = 0; i < this.settings.players.length; i++) {
//    //        this.settings.playerObj = {
//    //            playername: this.settings.players[i].name,
//    //            team: this.settings.players[i].team,
//    //            gamesplayed: 0,
//    //            wins: 0,
//    //            losses: 0,
//    //            draws: 0,
//    //            goalsForward: 0,
//    //            goalsAgainst: 0,
//    //            plusminus: 0,
//    //            points: 0,
//    //            playedGames: {},
//    //            finished: false
//    //        }
//    //        this.settings.playersArr.push(this.settings.playerObj);
//    //    }

//    //    //$scope.$watch(angular.bind(this, function () {
//    //    //    return this.playersArr;
//    //    //}), function (newValue, oldValue) {
//    //    //    console.log((newValue + '  -  ' + oldValue));
//    //    //    this.finishedPlayers = [];

//    //    //    newValue.forEach(function (player) {
//    //    //        if (player.finished === true) {
//    //    //            this.finishedPlayers.push(player);
//    //    //        }
//    //    //    });
//    //    //    if (finishedPlayers.length === newValue.length) {
//    //    //        console.log("Group is finished");
//    //    //    }
//    //    //    }, true);

//    //    this.settings.gamesForEachPlayer = this.settings.doubleMeeting === true
//    //        ? (this.settings.players.length - 1) * 2
//    //        : (this.settings.players.length - 1) * 1;

//    //    return this.settings;
//    //}

//});

myApp.controller('TableController', ['$scope', '_tournament', function ($scope, _tournament) {
    this.idFromParam = new URL(window.location.href).searchParams.get("ID");

    var tournamentSettings
    _tournament.get(this.idFromParam, (function(response){
        tournamentSettings = response;
        waitForAjax();
    }));
    
    function waitForAjax() {

        if (tournamentSettings === null || typeof tournamentSettings != "undefined") {

            this.name = tournamentSettings.name;
            this.playersArr = tournamentSettings.players;
            this.fixures = [];
            this.games = [];
            this.groupFinished = false;

            this.RoundRobin = function (t) {
                var e = []
                    , p = +t + (t % 2)
                    , a = new Array(p - 1)
                    , l = a.length
                    , pos
                    , i
                    , r
                    , pos2;
                for (x = p; x--;) { a[x] = (x + 1) }
                p ^ t && (a[p - 1] = "_");
                for (r = 1; r < l + 1; r++) {
                    if (r % 2 !== 0 && a[l - (r - 1)] !== "_" && a[0] !== "_") {
                        e.push({ r: r, a: a[0], b: a[l - (r - 1)] });
                    } else if (a[l - (r - 1)] !== "_" && a[0] !== "_") {
                        e.push({ r: r, a: a[l - (r - 1)], b: a[0] });
                    }
                    for (i = 2; i < (p / 2) + 1; i++) {
                        pos = (i + (r - 2)) >= l ? ((l - (i + (r - 2)))) * -1 : (i + (r - 2));
                        pos2 = (pos - (r - 2)) - r;
                        pos2 > 0 && (pos2 = (l - pos2) * -1);
                        pos2 < (l * -1) && (pos2 += l);
                        if (a[(l + pos2)] !== "_" && a[(l - pos)] !== "_") {
                            e.push({ r: r, a: a[(l + pos2)], b: a[(l - pos)] })
                        }
                    }
                }
                return e;
            }

            var res = this.RoundRobin(this.playersArr.length);

            for (i = 0; i < res.length; i++) {
                this.matchObj = {};
                this.matchObj.gameNr = i + 1;
                this.matchObj.round = res[i].r;
                this.matchObj.homeTeam = this.playersArr[res[i].a - 1];
                this.matchObj.awayTeam = this.playersArr[res[i].b - 1];
                this.matchObj.homeGoals = new Number();
                this.matchObj.awayGoals = new Number();;
                this.games.push(this.matchObj);
            }

            if (this.doubleMeeting) {
                for (x = 0; x < res.length; x++) {
                    this.matchObj = {};
                    this.matchObj.gameNr = x + 1;
                    this.matchObj.round = res.length + res[x].r;
                    this.matchObj.homeTeam = this.playersArr[res[x].b - 1];
                    this.matchObj.awayTeam = this.playersArr[res[x].a - 1];
                    this.matchObj.homeGoals = new Number();
                    this.matchObj.awayGoals = new Number();
                    this.games.push(this.matchObj);
                }
            }

            this.calcScore = function (game) {
                this.homeTeam = game.homeTeam;
                this.awayTeam = game.awayTeam;
                this.gameVar = game.round.toString() + ":" + game.gameNr.toString();

                this.homeGameID = {};//game.round.toString() + ":" + game.gameNr.toString();}
                this.awayGameID = {};
                this.homeTeam.playedGames[this.gameVar] = {};
                this.awayTeam.playedGames[this.gameVar] = {};
                //if (this.homeTeam.playedGames.indexOf(this.gameID) === -1 && this.awayTeam.playedGames.indexOf(this.gameID) === -1) {
                //this.homeTeam.playedGames.push(this.gameID);
                //this.awayTeam.playedGames.push(this.gameID);

                this.homeTeam.playedGames[this.gameVar].goalsForward = /*this.homeTeam.goalsForward +*/ game.homeGoals;
                this.homeTeam.playedGames[this.gameVar].goalsAgainst = /*this.homeTeam.goalsAgainst +*/ game.awayGoals;
                this.awayTeam.playedGames[this.gameVar].goalsForward = /*this.awayTeam.goalsForward +*/ game.awayGoals;
                this.awayTeam.playedGames[this.gameVar].goalsAgainst = /*this.awayTeam.goalsAgainst +*/ game.homeGoals;

                if (game.homeGoals > game.awayGoals) {
                    this.homeTeam.playedGames[this.gameVar].wins = 1;
                    this.awayTeam.playedGames[this.gameVar].losses = 1;
                    this.homeTeam.playedGames[this.gameVar].points = 2;
                    this.homeTeam.playedGames[this.gameVar].draws = 0;
                    this.awayTeam.playedGames[this.gameVar].draws = 0;
                    this.awayTeam.playedGames[this.gameVar].wins = 0;
                    this.homeTeam.playedGames[this.gameVar].losses = 0;
                    this.awayTeam.playedGames[this.gameVar].points = 0;
                }
                else if (game.homeGoals < game.awayGoals) {
                    this.awayTeam.playedGames[this.gameVar].wins = 1;
                    this.homeTeam.playedGames[this.gameVar].losses = 1;
                    this.awayTeam.playedGames[this.gameVar].points = 2;
                    this.homeTeam.playedGames[this.gameVar].draws = 0;
                    this.awayTeam.playedGames[this.gameVar].draws = 0;
                    this.homeTeam.playedGames[this.gameVar].wins = 0;
                    this.awayTeam.playedGames[this.gameVar].losses = 0;
                    this.homeTeam.playedGames[this.gameVar].points = 0;
                }
                else if (game.homeGoals === game.awayGoals) {
                    this.homeTeam.playedGames[this.gameVar].draws = 1;
                    this.awayTeam.playedGames[this.gameVar].draws = 1;
                    this.awayTeam.playedGames[this.gameVar].points = 1;
                    this.homeTeam.playedGames[this.gameVar].points = 1;
                    this.awayTeam.playedGames[this.gameVar].wins = 0;
                    this.homeTeam.playedGames[this.gameVar].losses = 0;
                    this.homeTeam.playedGames[this.gameVar].wins = 0;
                    this.awayTeam.playedGames[this.gameVar].losses = 0;
                }
                this.calcTable(this.homeTeam, this.awayTeam, this.gamesForEachPlayer);
            }

            this.calcTable = function (homeTeam, awayTeam, gamesToPlay) {
                this.teams = [];
                this.teams.push(homeTeam, awayTeam);

                this.teams.forEach(function (team) {
                    this.merge = [];
                    this.teamStats = {
                        gamesplayed: 0,
                        wins: 0,
                        losses: 0,
                        draws: 0,
                        goalsForward: 0,
                        goalsAgainst: 0,
                        points: 0
                    };

                    var played = 1;

                    Object.keys(team.playedGames).forEach(function (key) {
                        this.teamStats.goalsForward = this.teamStats.goalsForward + team.playedGames[key].goalsForward;
                        this.teamStats.goalsAgainst = this.teamStats.goalsAgainst + team.playedGames[key].goalsAgainst;
                        this.teamStats.wins = this.teamStats.wins + team.playedGames[key].wins;
                        this.teamStats.losses = this.teamStats.losses + team.playedGames[key].losses;
                        this.teamStats.draws = this.teamStats.draws + team.playedGames[key].draws;
                        this.teamStats.points = this.teamStats.points + team.playedGames[key].points;
                        this.teamStats.gamesplayed = played;
                        played++;
                    });
                    team.goalsForward = this.teamStats.goalsForward;
                    team.goalsAgainst = this.teamStats.goalsAgainst;
                    team.plusminus = this.teamStats.goalsForward - this.teamStats.goalsAgainst;
                    team.wins = this.teamStats.wins;
                    team.losses = this.teamStats.losses;
                    team.draws = this.teamStats.draws;
                    team.points = this.teamStats.points;
                    team.gamesplayed = this.teamStats.gamesplayed;
                    team.finished = team.gamesplayed === gamesToPlay ? true : false;

                });
            }
        }
        else {
            setTimeout(waitForAjax, 1000);
        }
    }

    waitForAjax();

}]);

//myApp.controller('PlayOffController', ['$scope', '_tournament', function ($scope, _tournament) {
    
//    this.renderTree = function() {
//        this.firstRound = [];
//        this.playersArr = angular.copy(_tournamentService.playersArr).sort(function(a, b) {
//            if (a.points < b.points)
//                return 1;
//            if (a.points > b.points)
//                return -1;
//            return 0;
//        }).slice(0, parseInt(_tournamentService.settings.TeamToPlayoff));
//        while (this.playersArr.length) {
//            this.firstRound.push(new Array(this.playersArr.length !== 0 ? this.playersArr.shift().name : null, this.playersArr.length !== 0 ? this.playersArr.pop().name : null));
//        }

//        var saveData = {
//            teams: this.firstRound,
//            results: []
//        };

//        /* Called whenever bracket is modified
//         *
//         * data:     changed bracket object in format given to init
//         * userData: optional data given when bracket is created.
//         */
//        function saveFn(data, userData) {
//            var json = angular.toJson(data);
//            $('#saveOutput').text('POST ' + json);
//            /* You probably want to do something like this
//            jQuery.ajax("rest/"+userData, {contentType: 'application/json',
//                                          dataType: 'json',
//                                          type: 'post',
//                                          data: json})
//            */
//        };


//        $(function () {
//            var container = $('.demo');
//            container.bracket({
//                init: saveData,
//                save: saveFn,
//                skipGrandFinalComeback: false,
//                skipConsolationRound: true,
//                disableToolbar: true,
//                disableTeamEdit: true


//            });

//            /* You can also inquiry the current data */
//            var data = container.bracket('data')
//            $('#dataOutput').text(angular.toJson(data));
//        });
//    };
//}]);

myApp.directive('tournamentSettings', function () {
    return {
        templateUrl: 'settings.html'
    };
});

myApp.directive('tournamentTable', function () {
    return {
        templateUrl: 'table.html'
    };
});

//myApp.directive('tournamentPlayoff', function () {
//    return {
//        templateUrl: 'playoff.html'
//    };
//});


