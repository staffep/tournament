angular.module('myApp.settings', []);

myApp.controller('TournamentController', ['$http', '_tournament', '$scope', function ($http, _tournament, $scope) {
    $scope.checkStatus = function () {
        if (window.location.href.indexOf("/tournamentmode") > -1) {
            $scope.currentStatus = "table";
        } else {
            $scope.currentStatus = "settings";
            $scope.isCollapsed = true;
            this.name = "";
            this.qty = 2;
            this.doubleMeeting = false;
            this.playoff = false;
            this.teamsToPlayOff = [];
            $scope.initMeetings = function () {
                this.playoffMeetings = this.playoff === false ? 0 : [1, 3, 5, 7];
            }
            this.playoffMeetings = 0;
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
            this.bracket = "";

            $scope.teams = [
                {
                    fullName: 'Carolina Hurricanes',
                    abbrevation: 'car'
                },
                {
                    fullName: 'Columbus Blue Jackets',
                    abbrevation: 'cbj'
                },
                {
                    fullName: 'New Jersey Devils',
                    abbrevation: 'njd'
                },
                {
                    fullName: 'New York Islanders',
                    abbrevation: 'nyi'
                },
                {
                    fullName: 'New York Rangers',
                    abbrevation: 'nyr'
                },
                {
                    fullName: 'Philadelphia Flyers',
                    abbrevation: 'phi'
                },
                {
                    fullName: 'Pittsburgh Penguins',
                    abbrevation: 'pit'
                },
                {
                    fullName: 'Washington Capitals',
                    abbrevation: 'was'
                },
                {
                    fullName: 'Boston Bruins',
                    abbrevation: 'bos'
                },
                {
                    fullName: 'Buffalo Sabres',
                    abbrevation: 'buf'
                },
                {
                    fullName: 'Detroit Red Wings',
                    abbrevation: 'det'
                },
                {
                    fullName: 'Florida Panthers',
                    abbrevation: 'flo'
                },
                {
                    fullName: 'Montreal Canadiens',
                    abbrevation: 'cbj'
                },
                {
                    fullName: 'Ottawa Senators',
                    abbrevation: 'ott'
                },
                {
                    fullName: 'Tampa Bay Lightning',
                    abbrevation: 'tbl'
                },
                {
                    fullName: 'Toronto Maple Leafs',
                    abbrevation: 'tor'
                },
                {
                    fullName: 'Chicago Blackhawks',
                    abbrevation: 'chi'
                },
                {
                    fullName: 'Colorado Avalanche',
                    abbrevation: 'col'
                },
                {
                    fullName: 'Dallas Stars',
                    abbrevation: 'dal'
                },
                {
                    fullName: 'Minnesota Wild',
                    abbrevation: 'min'
                },
                {
                    fullName: 'Nashville Predators',
                    abbrevation: 'nas'
                },
                {
                    fullName: 'St.Louis Blues',
                    abbrevation: 'stl'
                },
                {
                    fullName: 'Winnipeg Jets',
                    abbrevation: 'win'
                },
                {
                    fullName: 'Anaheim Ducks',
                    abbrevation: 'ana'
                },
                {
                    fullName: 'Arizona Coyotes',
                    abbrevation: 'ari'
                },
                {
                    fullName: 'Calgary Flames',
                    abbrevation: 'cal'
                },
                {
                    fullName: 'Edmonton Oilers',
                    abbrevation: 'edm'
                },
                {
                    fullName: 'Los Angeles Kings',
                    abbrevation: 'lak'
                },
                {
                    fullName: 'San Jose Sharks',
                    abbrevation: 'san'
                },
                {
                    fullName: 'Vancouver Canucks',
                    abbrevation: 'van'
                },
                {
                    fullName: 'Vegas Golden Knights',
                    abbrevation: 'vgk'
                }
            ];

            this.getNumber = function (num) {
                var playersIds = new Array(num);
                return playersIds;
            }

            this.save = function () {
                this.players.forEach(function (player) {
                    $scope.teams.forEach(function (team) {
                        if (player.team === team.fullName) {
                            player.team = {
                                'fullName': team.fullName,
                                'abbrevation': team.abbrevation
                            };
                        }
                    });
                });

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
                    this.settings.players[i].otLoss = 0;
                    this.settings.players[i].goalsForward = 0;
                    this.settings.players[i].goalsAgainst = 0;
                    this.settings.players[i].plusminus = 0;
                    this.settings.players[i].points = 0;
                    this.settings.players[i].playedGames = {};
                    this.settings.players[i].finished = false;

                }

                _tournament.post(this.settings,
                    (function (response) {

                        $scope.checkStatus();
                    }));


            }
            $scope.earliearTournaments = [];
            _tournament.getAll(function (response) {
                $scope.earliearTournaments = response;
            });
        }
    }

    $scope.checkStatus();
}]);


myApp.directive('tournamentSettings', function () {
    return {
        templateUrl: '../views/settings.html'
    };
});