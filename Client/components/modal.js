angular.module('myApp.modal', []);

myApp.component('myModal', {
    templateUrl: '../views/playoffmodal.html',
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
