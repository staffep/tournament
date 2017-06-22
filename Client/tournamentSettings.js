var myApp = angular.module("tournament", ["ui.bootstrap"]);

myApp.value('globalVars', {settings: []});

myApp.controller('TournamentController', ['$http', '_tournament', '$scope', function ($http, _tournament, $scope) {
    $scope.checkStatus = function() {
        if (window.location.href.indexOf("/tournamentmode") > -1) {
            $scope.currentStatus = "table";
        } else {
            $scope.currentStatus = "settings";

            this.name = "";
            this.qty = 2;
            this.doubleMeeting = false;
            this.playoff = false;
            this.teamsToPlayOff = [];
            this.playoffMeetings = [1,3,5,7];
            this.teamsToPlayoff = function(teamsInGroup) {
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
            this.bracket = "";

            this.teams = [
                'Carolina Hurricanes',
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
                'Montr�al Canadiens',
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
                'Vegas Golden Knights'
            ];

            this.getNumber = function(num) {
                var playersIds = new Array(num);
                return playersIds;
            }

            this.save = function() {
                this.settings = {
                    "tournamentId": this.id,
                    "name": this.name,
                    "players": this.players,
                    "doubleMeeting": this.doubleMeeting,
                    "playoff": this.playoff,
                    "teamsToPlayoff": this.finalTeamsToPlayOff,
                    "playoffMeetings": this.playoffMeetings,
                    "games": [],
                    "bracket": this.bracket,
                    "gamesForEachPlayer": this.doubleMeeting === true
                        ? (this.players.length - 1) * 2
                        : (this.players.length - 1) * 1
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

                _tournament.post(this.settings,
                    (function(response) {

                        $scope.checkStatus();
                    }));


            }
            $scope.earliearTournaments = [];
            _tournament.getAll(function(response) {
                $scope.earliearTournaments = response;
            });
        }
    }

    $scope.checkStatus();
}]);

myApp.service('_tournament', ['$http', 'globalVars', function ($http, globalVars) {
    
    this.post = function (settings, callback) {
        $http({
                method: 'POST',
                url: 'http://localhost:3000/tournament',
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
                url: 'http://localhost:3000/tournament/' + id,
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
                url: 'http://localhost:3000/tournament/' + globalVars.settings.tournamentId.toString(),
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
                url: 'http://localhost:3000/tournament/' + globalVars.settings.tournamentId.toString(),
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
                url: 'http://localhost:3000/tournament',
                headers: { 'Content-Type': 'application/json' }
            })
            .success(function (data) {
                console.log(data);
                callback(data);
            });
    }

}]);

myApp.controller('TableController', ['$scope', '_tournament', 'globalVars', function ($scope, _tournament, globalVars) {
    this.idFromParam = new URL(window.location.href).searchParams.get("ID");
    _tournament.get(this.idFromParam, (function(response){
        globalVars.settings = response;
        $scope.Tournament();
    }));
    
    $scope.Tournament = function() {

        if (globalVars.settings === null || typeof globalVars.settings != "undefined") {

            $scope.name = globalVars.settings.name;
            $scope.playersArr = globalVars.settings.players;
            this.fixures = [];
            $scope.games = globalVars.settings.games;
            this.groupFinished = false;

            if ($scope.games.length === 0) {
                this.RoundRobin = function(t) {
                    var e = [], p = +t + (t % 2), a = new Array(p - 1), l = a.length, pos, i, r, pos2;
                    for (x = p; x--;) {
                        a[x] = (x + 1)
                    }
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

                var res = this.RoundRobin($scope.playersArr.length);

                for (i = 0; i < res.length; i++) {
                    this.matchObj = {};
                    this.matchObj.gameNr = i + 1;
                    this.matchObj.round = res[i].r;
                    this.matchObj.homeTeam = $scope.playersArr[res[i].a - 1];
                    this.matchObj.awayTeam = $scope.playersArr[res[i].b - 1];
                    this.matchObj.homeGoals = new Number();
                    this.matchObj.awayGoals = new Number();
                    this.matchObj.gamePlayed = false;
                    $scope.games.push(this.matchObj);
                }

                if (globalVars.settings.doubleMeeting) {
                    for (x = 0; x < res.length; x++) {
                        this.matchObj = {};
                        this.matchObj.gameNr = x + 1;
                        this.matchObj.round = res.length + res[x].r;
                        this.matchObj.homeTeam = $scope.playersArr[res[x].b - 1];
                        this.matchObj.awayTeam = $scope.playersArr[res[x].a - 1];
                        this.matchObj.homeGoals = new Number();
                        this.matchObj.awayGoals = new Number();
                        this.matchObj.isPlayed = false;
                        $scope.games.push(this.matchObj);
                    }
                }
            }

            $scope.calcScore = function (game, oldGameValue) {
                this.homeTeam = game.homeTeam;
                this.awayTeam = game.awayTeam;

                if (game.gamePlayed === true) {
                    if (game.homeGoals != oldGameValue.homeGoals ||
                        game.awayGoals != oldGameValue.awayGoals) {
                        oldGameValue.homeGoals === null ? 0 : oldGameValue.homeGoals;
                        oldGameValue.awayGoals === null ? 0 : oldGameValue.awayGoals;
                        if (typeof this.homeTeam.goalsForward === "undefined") {
                            this.homeTeam = this.homeTeam[0]
                        }
                        if (typeof this.awayTeam.goalsForward === "undefined") {
                            this.awayTeam = this.awayTeam[0];
                        }
                        
                        this.homeTeam.goalsForward = this.homeTeam.goalsForward - oldGameValue.homeGoals;
                        this.homeTeam.goalsAgainst = this.homeTeam.goalsAgainst - oldGameValue.awayGoals;
                        this.homeTeam.plusminus = this.homeTeam.plusminus - (oldGameValue.homeGoals - oldGameValue.awayGoals);

                        this.awayTeam.goalsForward = this.awayTeam.goalsForward - oldGameValue.awayGoals;
                        this.awayTeam.goalsAgainst = this.awayTeam.goalsAgainst - oldGameValue.homeGoals;
                        this.awayTeam.plusminus = this.awayTeam.plusminus - (oldGameValue.awayGoals - oldGameValue.homeGoals);
                        

                        if (oldGameValue.homeGoals > oldGameValue.awayGoals) {
                            this.homeTeam.wins = this.homeTeam.wins === 0 ? 0 : this.homeTeam.wins - 1;
                            this.awayTeam.losses = this.awayTeam.losses === 0 ? 0 : this.awayTeam.losses - 1;
                            this.homeTeam.points = this.homeTeam.points === 0 ? 0 : this.homeTeam.points - 2;
                            this.homeTeam.draws = this.homeTeam.draws === 0 ? 0 : this.homeTeam.draws + 0;
                            this.awayTeam.draws = this.awayTeam.draws === 0 ? 0 : this.awayTeam.draws + 0;
                            this.awayTeam.wins = this.awayTeam.wins === 0 ? 0 : this.awayTeam.wins + 0;
                            this.homeTeam.losses = this.homeTeam.losses === 0 ? 0 : this.homeTeam.losses + 0;
                            this.awayTeam.points = this.awayTeam.points === 0 ? 0 : this.awayTeam.points + 0;
                        }

                        else if (oldGameValue.homeGoals < oldGameValue.awayGoals) {
                            this.homeTeam.wins = this.homeTeam.wins === 0 ? 0 : this.homeTeam.wins + 0;
                            this.awayTeam.losses = this.awayTeam.losses === 0 ? 0 : this.awayTeam.losses + 0;
                            this.homeTeam.points = this.homeTeam.points === 0 ? 0 : this.homeTeam.points + 0;
                            this.homeTeam.draws = this.homeTeam.draws === 0 ? 0 : this.homeTeam.draws + 0;
                            this.awayTeam.draws = this.awayTeam.draws === 0 ? 0 : this.awayTeam.draws + 0;
                            this.awayTeam.wins = this.awayTeam.wins === 0 ? 0 : this.awayTeam.wins - 1;
                            this.homeTeam.losses = this.homeTeam.losses === 0 ? 0 : this.homeTeam.losses - 1;
                            this.awayTeam.points = this.awayTeam.points === 0 ? 0 : this.awayTeam.points - 2;
                        }
                        else if (oldGameValue.homeGoals === oldGameValue.awayGoals) {
                            this.homeTeam.wins = this.homeTeam.wins === 0 ? 0 : this.homeTeam.wins + 0;
                            this.awayTeam.losses = this.awayTeam.losses === 0 ? 0 : this.awayTeam.losses + 0;
                            this.homeTeam.points = this.homeTeam.points === 0 ? 0 : this.homeTeam.points - 1;
                            this.homeTeam.draws = this.homeTeam.draws === 0 ? 0 : this.homeTeam.draws - 1;
                            this.awayTeam.draws = this.awayTeam.draws === 0 ? 0 : this.awayTeam.draws - 1;
                            this.awayTeam.wins = this.awayTeam.wins === 0 ? 0 : this.awayTeam.wins + 0;
                            this.homeTeam.losses = this.homeTeam.losses === 0 ? 0 : this.homeTeam.losses + 0;
                            this.awayTeam.points = this.awayTeam.points === 0 ? 0 : this.awayTeam.points - 1;
                        }

                        $scope.calcTable(this.homeTeam, this.awayTeam, game);
                    }
                } else {
                    this.homeTeam.gamesplayed++;
                    this.awayTeam.gamesplayed++;
                    game.gamePlayed = true;
                    $scope.calcTable(this.homeTeam, this.awayTeam, game);
                }
               
            }

            $scope.calcTable = function (homeTeam, awayTeam, game) {
                
                homeTeam.goalsForward = homeTeam.goalsForward + game.homeGoals;
                homeTeam.goalsAgainst = homeTeam.goalsAgainst + game.awayGoals;
                homeTeam.plusminus = homeTeam.plusminus + (game.homeGoals - game.awayGoals);
                
                awayTeam.goalsForward = awayTeam.goalsForward + game.awayGoals;
                awayTeam.goalsAgainst = awayTeam.goalsAgainst + game.homeGoals;
                awayTeam.plusminus = awayTeam.plusminus + (game.awayGoals - game.homeGoals);

                if (game.homeGoals > game.awayGoals) {
                    homeTeam.wins = homeTeam.wins + 1;
                    awayTeam.losses = awayTeam.losses + 1;
                    homeTeam.points = homeTeam.points + 2;
                    homeTeam.draws = homeTeam.draws + 0;
                    awayTeam.draws = awayTeam.draws + 0;
                    awayTeam.wins = awayTeam.wins + 0;
                    homeTeam.losses = homeTeam.losses + 0;
                    awayTeam.points = awayTeam.points + 0;
                }

                else if (game.homeGoals < game.awayGoals) {
                    homeTeam.wins = homeTeam.wins + 0;
                    awayTeam.losses = awayTeam.losses + 0;
                    homeTeam.points = homeTeam.points + 0;
                    homeTeam.draws = homeTeam.draws + 0;
                    awayTeam.draws = awayTeam.draws + 0;
                    awayTeam.wins = awayTeam.wins + 1;
                    homeTeam.losses = homeTeam.losses + 1;
                    awayTeam.points = awayTeam.points + 2;
                }
                else if (game.homeGoals === game.awayGoals) {
                    homeTeam.wins = homeTeam.wins + 0;
                    awayTeam.losses = awayTeam.losses + 0;
                    homeTeam.points = homeTeam.points + 1;
                    homeTeam.draws = homeTeam.draws + 1;
                    awayTeam.draws = awayTeam.draws + 1;
                    awayTeam.wins = awayTeam.wins + 0;
                    homeTeam.losses = homeTeam.losses + 0;
                    awayTeam.points = awayTeam.points + 1;
                }
                
                _tournament.update(new URL(window.location.href).searchParams.get("ID"), homeTeam, awayTeam, (function (response) {}));
            }
        }
        else {
            setTimeout($scope.Tournament, 1000);
        }
    }

}]);
myApp.controller('PlayOffController', ['$scope', '_tournament', 'globalVars', '$uibModal', function ($scope, _tournament, globalVars, $uibModal) {
    $scope.bracket = { playoffMeetings: new Number(), results:[]};

    $scope.gameChanged = function(player) {
        console.log(player);
    }

    $scope.open = function (matchup) {
        
        $scope.matchup = matchup;
            $scope.showModal = true;

            $uibModal.open({
                component: "myModal",
                resolve: {
                    matchup: function () {
                        return matchup;
                    },
                    bracket: function(){
                        return $scope.bracket;
                    }
                }
            }).result.then(function (result) {
                _tournament.updateBracket(new URL(window.location.href).searchParams.get("ID"), result.bracket, (function (response) {

                }));

                let index = 0;
                result.matchup.totalresults.forEach(function(gamesWon) {
                    if (gamesWon === Math.round(result.bracket.playoffMeetings / 2)) {
                        for (let i = 0; i < result.bracket.results.length; i++) {
                            for (let x = 0; x < result.bracket.results[i].length; x++) {
                                if (result.bracket.results[i][x].id === result.matchup.id) {
                                    console.log(result.bracket.results[i][x].id);
                                    for (let z = 0; z < result.bracket.results[i+1].length; z++){
                                        for (let y = 0; y < result.bracket.results[i + 1][z].teams.length; y++) {
                                            if (result.bracket.results[i + 1][z].fromId1 === result.matchup.id
                                                || result.bracket.results[i + 1][z].fromId2 === result.matchup.id) {
                                                if (result.bracket.results[i + 1][z].teams[y] === "TBD") {
                                                    result.bracket.results[i + 1][z].teams[y] = result.matchup.teams[index];

                                                    _tournament.updateBracket(new URL(window.location.href).searchParams.get("ID"), result.bracket, (function (response) {

                                                    }));
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    index++;
                });

            }, function (reason) {
            });
        };

        $scope.ok = function () {
            $scope.showModal = false;
        };

        $scope.cancel = function () {
            $scope.showModal = false;
        };

        this.initBracket = function() {
            this.idFromParam = new URL(window.location.href).searchParams.get("ID");
            _tournament.get(this.idFromParam,
                (function(response) {
                    if (response.bracket === "") {
                        $scope.createBracket(response);
                    } else {
                        $scope.bracket = angular.fromJson(response.bracket);
                    }
                }));
        }

        $scope.createBracket = function(response) {
            $scope.bracket.playoffMeetings = response.playoffMeetings;
            this.firstRound = [];

            let playersArr = response.players.sort(function(a, b) {
                if (a.points < b.points)
                    return 1;
                if (a.points > b.points)
                    return -1;
                return 0;
            }).slice(0, parseInt(response.teamsToPlayoff));

            while (playersArr.length) {
                this.firstRound.push(new Array(playersArr.length !== 0 ? playersArr.shift().playername : null,
                    playersArr.length !== 0 ? playersArr.pop().playername : null));

            }
            var id = 0;
            for (x = this.firstRound.length; x >= 1; x--) {
                if (x === 64 || x === 32 || x === 16 || x === 8 || x === 4 || x === 2 || x === 1) {
                    var arr = new Array();
                    if (x === this.firstRound.length) {

                        for (var i = 0; i <= x - 1; i++) {
                            var matches = [];
                            for (var y = 0; y < response.playoffMeetings; y++) {
                                var game = new Array(0, 0);
                                matches.push(game);
                            }
                            var arr2 = { teams: this.firstRound[i],
                                totalresults: [0, 0],
                                matches: matches,
                                id: new String(id + 1) + "." + new String(i + 1)
                            };
                            arr.push(arr2);
                        };

                    } else {
                        for (var i = 0; i <= x - 1; i++) {
                            var matches2 = [];
                            for (var y = 0; y < response.playoffMeetings; y++) {
                                var game = new Array(0, 0);
                                matches2.push(game);
                            }
                            var arr3 = { teams: ["TBD", "TBD"],
                                totalresults: [0, 0],
                                matches: matches2,
                                id: new String(id + 1) + "." + new String(i + 1),
                                fromId1: new String(id) + "." + new String((i + 1) * 2 - 1),
                                fromId2: new String(id) + "." + new String((i + 1) * 2)
                            };
                            arr.push(arr3);
                        };
                    }

                    $scope.bracket.results.push(arr);
                    id++;
                }
            }
            _tournament.updateBracket(new URL(window.location.href).searchParams.get("ID"), $scope.bracket, (function(response) {
                
            }));

            
        }
}]);

myApp.component('myModal', {
    templateUrl: 'playoffmodal.html',
        bindings: {
            modalInstance: "<",
            resolve: "<"
        },
        controller: [function () {
            var $scope = this;

            $scope.modalData = $scope.resolve.matchup;
            $scope.bracket = $scope.resolve.bracket;

            $scope.handleClose = function () {
                $scope.modalInstance.close({ matchup: $scope.modalData, bracket: $scope.bracket });
            };

            $scope.handleDismiss = function () {
                console.info("in handle dismiss");
                $scope.modalInstance.dismiss("cancel");
            };

            $scope.calcScore = function (matchup) {
                matchup.totalresults[0] = 0;
                matchup.totalresults[1] = 0;
                matchup.matches.forEach(function (match) {
                    
                    if (match[0] > match[1]) {
                        matchup.totalresults[0]++;
                    }
                    else if (match[0] < match[1]) {
                        matchup.totalresults[1]++;
                    }
                })
            }
        }]
    });

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

myApp.directive('tournamentPlayoff', function () {
    return {
        templateUrl: 'playoff.html'
    };
});


