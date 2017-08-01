angular.module('myApp.table', []);

myApp.controller('TableController', ['$scope', '_tournament', 'globalVars', function ($scope, _tournament, globalVars) {
    this.idFromParam = new URL(window.location.href).searchParams.get("ID");
    _tournament.get(this.idFromParam, (function (response) {
        globalVars.settings = response;
        $scope.Tournament();
    }));

    $scope.Tournament = function () {

        if (globalVars.settings === null || typeof globalVars.settings != "undefined") {

            $scope.sortDir = false;
            $scope.name = globalVars.settings.name;
            $scope.playersArr = globalVars.settings.players;
            this.fixures = [];
            $scope.games = globalVars.settings.games;
            $scope.teamsToPlayOff = globalVars.settings.teamsToPlayoff;
            this.groupFinished = false;
            $scope.sortType = 'points';
            $scope.sortDir = !$scope.sortDir;

            if ($scope.games.length === 0) {
                this.RoundRobin = function (t) {
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
                    this.matchObj.ot = false;
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
                        this.matchObj.ot = false;
                        this.matchObj.isPlayed = false;
                        $scope.games.push(this.matchObj);
                    }
                }
            }

            $scope.calcScore = function (game, oldGameValue) {
                this.homeTeam = game.homeTeam;
                this.awayTeam = game.awayTeam;
                /*If game is played, reset score for game*/
                if (game.gamePlayed === true) {
                    if (game.homeGoals != oldGameValue.homeGoals ||
                        game.awayGoals != oldGameValue.awayGoals ||
                        game.ot != oldGameValue.ot) {
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


                        if (oldGameValue.homeGoals > oldGameValue.awayGoals && oldGameValue.ot === false) {
                            this.homeTeam.wins = this.homeTeam.wins === 0 ? 0 : this.homeTeam.wins - 1;
                            this.awayTeam.losses = this.awayTeam.losses === 0 ? 0 : this.awayTeam.losses - 1;
                            this.homeTeam.points = this.homeTeam.points === 0 ? 0 : this.homeTeam.points - 2;
                            this.homeTeam.draws = this.homeTeam.draws === 0 ? 0 : this.homeTeam.draws + 0;
                            this.awayTeam.draws = this.awayTeam.draws === 0 ? 0 : this.awayTeam.draws + 0;
                            this.awayTeam.wins = this.awayTeam.wins === 0 ? 0 : this.awayTeam.wins + 0;
                            this.homeTeam.losses = this.homeTeam.losses === 0 ? 0 : this.homeTeam.losses + 0;
                            this.awayTeam.points = this.awayTeam.points === 0 ? 0 : this.awayTeam.points + 0;
                        }

                        else if (oldGameValue.homeGoals < oldGameValue.awayGoals && oldGameValue.ot === false) {
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
                        if (oldGameValue.homeGoals > oldGameValue.awayGoals && oldGameValue.ot === true) {
                            this.homeTeam.wins = this.homeTeam.wins === 0 ? 0 : this.homeTeam.wins - 1;
                            this.awayTeam.losses = this.awayTeam.losses === 0 ? 0 : this.awayTeam.losses - 0;
                            this.homeTeam.points = this.homeTeam.points === 0 ? 0 : this.homeTeam.points - 2;
                            this.homeTeam.draws = this.homeTeam.draws === 0 ? 0 : this.homeTeam.draws + 0;
                            this.awayTeam.draws = this.awayTeam.draws === 0 ? 0 : this.awayTeam.draws + 0;
                            this.awayTeam.wins = this.awayTeam.wins === 0 ? 0 : this.awayTeam.wins + 0;
                            this.homeTeam.losses = this.homeTeam.losses === 0 ? 0 : this.homeTeam.losses + 0;
                            this.awayTeam.points = this.awayTeam.points === 0 ? 0 : this.awayTeam.points - 1;
                            this.homeTeam.otLoss = this.homeTeam.otLoss === 0 ? 0 : this.homeTeam.otLoss + 0;
                            this.awayTeam.otLoss = this.awayTeam.otLoss === 0 ? 0 : this.awayTeam.otLoss - 1;
                        }

                        else if (oldGameValue.homeGoals < oldGameValue.awayGoals && oldGameValue.ot === true) {
                            this.homeTeam.wins = this.homeTeam.wins === 0 ? 0 : this.homeTeam.wins + 0;
                            this.awayTeam.losses = this.awayTeam.losses === 0 ? 0 : this.awayTeam.losses + 0;
                            this.homeTeam.points = this.homeTeam.points === 0 ? 0 : this.homeTeam.points - 1;
                            this.homeTeam.draws = this.homeTeam.draws === 0 ? 0 : this.homeTeam.draws + 0;
                            this.awayTeam.draws = this.awayTeam.draws === 0 ? 0 : this.awayTeam.draws + 0;
                            this.awayTeam.wins = this.awayTeam.wins === 0 ? 0 : this.awayTeam.wins - 1;
                            this.homeTeam.losses = this.homeTeam.losses === 0 ? 0 : this.homeTeam.losses + 0;
                            this.awayTeam.points = this.awayTeam.points === 0 ? 0 : this.awayTeam.points - 2;
                            this.homeTeam.otLoss = this.homeTeam.otLoss === 0 ? 0 : this.homeTeam.otLoss - 1;
                            this.awayTeam.otLoss = this.awayTeam.otLoss === 0 ? 0 : this.awayTeam.otLoss + 0;
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

                if (typeof game.homeGoals === "object") {
                    game.homeGoals = 0;
                }
                if (typeof game.awayGoals === "object") {
                    game.awayGoals = 0;
                }

                homeTeam.goalsForward = homeTeam.goalsForward + game.homeGoals;
                homeTeam.goalsAgainst = homeTeam.goalsAgainst + game.awayGoals;
                homeTeam.plusminus = homeTeam.plusminus + (game.homeGoals - game.awayGoals);

                awayTeam.goalsForward = awayTeam.goalsForward + game.awayGoals;
                awayTeam.goalsAgainst = awayTeam.goalsAgainst + game.homeGoals;
                awayTeam.plusminus = awayTeam.plusminus + (game.awayGoals - game.homeGoals);

                if (game.homeGoals > game.awayGoals && game.ot === false) {
                    homeTeam.wins = homeTeam.wins + 1;
                    awayTeam.losses = awayTeam.losses + 1;
                    homeTeam.points = homeTeam.points + 2;
                    homeTeam.draws = homeTeam.draws + 0;
                    awayTeam.draws = awayTeam.draws + 0;
                    awayTeam.wins = awayTeam.wins + 0;
                    homeTeam.losses = homeTeam.losses + 0;
                    awayTeam.points = awayTeam.points + 0;
                }

                else if (game.homeGoals < game.awayGoals && game.ot === false) {
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
                else if (game.homeGoals > game.awayGoals && game.ot === true) {
                    homeTeam.wins = homeTeam.wins + 1;
                    awayTeam.losses = awayTeam.losses + 0;
                    homeTeam.points = homeTeam.points + 2;
                    homeTeam.draws = homeTeam.draws + 0;
                    awayTeam.draws = awayTeam.draws + 0;
                    awayTeam.wins = awayTeam.wins + 0;
                    homeTeam.losses = homeTeam.losses + 0;
                    awayTeam.points = awayTeam.points + 1;
                    awayTeam.otLoss = awayTeam.otLoss + 1;
                    homeTeam.otLoss = homeTeam.otLoss + 0;
                }

                else if (game.homeGoals < game.awayGoals && game.ot === true) {
                    homeTeam.wins = homeTeam.wins + 0;
                    awayTeam.losses = awayTeam.losses + 0;
                    homeTeam.points = homeTeam.points + 1;
                    homeTeam.draws = homeTeam.draws + 0;
                    awayTeam.draws = awayTeam.draws + 0;
                    awayTeam.wins = awayTeam.wins + 1;
                    homeTeam.losses = homeTeam.losses + 0;
                    awayTeam.points = awayTeam.points + 2;
                    awayTeam.otLoss = awayTeam.otLoss + 0;
                    homeTeam.otLoss = homeTeam.otLoss + 1;
                }

                _tournament.update(new URL(window.location.href).searchParams.get("ID"), homeTeam, awayTeam, (function (response) { }));
            }
        }
        else {
            setTimeout($scope.Tournament, 1000);
        }
    }

}]);

myApp.directive('tournamentTable', function () {
    return {
        templateUrl: '../views/table.html'
    };
});