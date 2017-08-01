angular.module('myApp.playoff', []);

myApp.controller('PlayOffController', ['$scope', '_tournament', 'globalVars', '$uibModal', function ($scope, _tournament, globalVars, $uibModal) {

    $scope.bracket = { playoffMeetings: new Number(), results: [] };
    $scope.bracketButtonIsClicked = false;
    $scope.gameChanged = function (player) {
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
                bracket: function () {
                    return $scope.bracket;
                }
            }
        }).result.then(function (result) {
            _tournament.updateBracket(new URL(window.location.href).searchParams.get("ID"), result.bracket, (function (response) {

            }));

            let index = 0;
            result.matchup.totalresults.forEach(function (gamesWon) {
                if (gamesWon === Math.round(result.bracket.playoffMeetings / 2)) {
                    for (let i = 0; i < result.bracket.results.length; i++) {
                        for (let x = 0; x < result.bracket.results[i].length; x++) {
                            if (result.bracket.results[i][x].id === result.matchup.id) {
                                for (let z = 0; z < result.bracket.results[i + 1].length; z++) {
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

    $scope.initBracket = function () {
        this.idFromParam = new URL(window.location.href).searchParams.get("ID");
        _tournament.get(this.idFromParam,
            (function (response) {
                if (response.bracket === "" || angular.fromJson(response.bracket).bracketStarted !== true) {
                    $scope.createBracket(response);
                }
                else {
                    $scope.bracket = angular.fromJson(response.bracket);
                }
            }));
    }

    $scope.createBracket = function (response) {
        $scope.bracket.bracketStarted = true;
        $scope.bracket.playoffMeetings = response.playoffMeetings;
        $scope.bracket.winsToProceed = Math.round($scope.bracket.playoffMeetings / 2);
        this.firstRound = [];

        let playersArr = response.players.sort(function (a, b) {
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
                        var arr2 = {
                            teams: this.firstRound[i],
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
                        var arr3 = {
                            teams: ["TBD", "TBD"],
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
        _tournament.updateBracket(new URL(window.location.href).searchParams.get("ID"), $scope.bracket, (function (response) {

        }));


    }
}]);

myApp.directive('tournamentPlayoff', function () {
    return {
        templateUrl: '../views/playoff.html'
    };
});