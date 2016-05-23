var pipePlannerApp = angular.module("pipePlannerApp", ["ngDraggable"]);

pipePlannerApp.factory('teams', function () {
    var _data = {};

    var addTeam = function (name, comment) {
        var newID = Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 16);
        _data[newID] = {
            id: newID,
            name: name,
            comment: comment
        };
        return newID;
    };

    var getTeam = function (id) {
        return _data[id];
    };

    var getTeams = function () {
        return _data;
    };

    return {
        addTeam: addTeam,
        getTeam: getTeam,
        getTeams: getTeams
    };
});

pipePlannerApp.factory('experts', function () {
    var addExpert = function (name, comment) {
        var newID = Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 16);
        _data[newID] = {
            id: newID,
            name: name,
            comment: comment
        };
        return newID;
    };

    var getExpert = function (id) {
        return _data[id];
    };

    var getExperts = function () {
        return _data;
    };

    return {
        getExpert: getExpert,
        addExpert: addExpert,
        getExperts: getExperts
    };
});

pipePlannerApp.controller("TeamListCtrl", function ($scope, teams) {
    $scope.title = "Команды";
    $scope.teams = teams.getTeams();
    $scope.addTeam = teams.addTeam;
});

pipePlannerApp.controller("ExpertListCtrl", function ($scope, experts) {
    $scope.title = "Эксперты";
    $scope.experts = experts.getExperts();
    $scope.addExpert = experts.addExpert;
});

pipePlannerApp.controller("TimetableCtrl", function ($scope, experts, teams) {
    $scope.title = "Расписание";

    $scope.teams = teams;
    $scope.timetable = {};
    $scope.countIterations = 5;

    $scope.genZeroTimetable = function () {
        $scope.timetable = {};

        for(var i in experts) {
            $scope.timetable[i] = new Array($scope.countIterations);
            for (var j = 0; j < $scope.timetable[i].length; j++) {
                $scope.timetable[i][j] = {
                    cellType: 0,
                    teams: [  ]
                }
            }
        }
    };

    $scope.getExpertName = function (id) {
        return experts[id].name;
    };

    $scope.cellClick = function (expertID, iter) {
        if($scope.timetable[expertID][iter].cellType == 0 && $scope.timetable[expertID][iter].teams.length == 0) {
            $scope.timetable[expertID][iter].cellType = 1;
        } else {
            $scope.timetable[expertID][iter].cellType = 0;
        }
    };

    $scope.onDropComplete = function ($data, $event, cell) {
        if(cell.teams.indexOf($data) != -1) return;
        cell.teams.push($data);
    };

    $scope.deleteTeamFromCell = function (team, cell) {
        cell.teams = [];
        cell.cellType = 1;
    };

    $scope.fillAutoTimetable = function () {
        var teamWithExpert = {}; // teamID -> expertID

        /*for(var expertID in $scope.timetable) {
            for(int j = 0; j < $scope.timetable[expertID].teams.length; j++) {

            }
        }

        // Проверяем те, которые запонены вручную
        for(var i = 0; i < countIterations; i++) {
            if($scope.timetable[i]
        }*/
    }
});
