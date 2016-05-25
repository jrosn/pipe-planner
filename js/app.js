var pipePlannerApp = angular.module("pipePlannerApp", ["ngDraggable"]);

pipePlannerApp.factory('teams', function ($rootScope) {
    var _data = {};

    var addTeam = function (name, comment) {
        var newID = Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 16);
        _data[newID] = {
            id: newID,
            name: name,
            comment: comment
        };
        $rootScope.$broadcast("teams-updated");
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

pipePlannerApp.factory('experts', function ($rootScope) {
    var _data = {};

    var addExpert = function (name, comment) {
        var newID = Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 16);
        _data[newID] = {
            id: newID,
            name: name,
            comment: comment
        };
        $rootScope.$broadcast("experts-updated");
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

pipePlannerApp.factory('absenceTeam', function () {
    var absenceTeams = {};
    var setAbsenceTeam = function (teamID, iter) {
        if(absenceTeams[teamID] == undefined) {
            absenceTeams[teamID] = [];
        }
        absenceTeams[teamID].push(iter);
    };
    var delAbsenceTeam = function (teamID, iter) {
        absenceTeams[teamID] = absenceTeams[teamID].filter(function (x) {
            return x != iter;
        });
    };
    var isAbsenceTeam = function (teamID, iter) {
        return absenceTeams[teamID] != undefined && absenceTeams[teamID].indexOf(iter) != -1;
    };
    return {
        setAbsenceTeam: setAbsenceTeam,
        delAbsenceTeam: delAbsenceTeam,
        isAbsenceTeam: isAbsenceTeam
    }
});

pipePlannerApp.factory('absenceExpert', function () {
    var absenceExperts = {};
    var setAbsenceExpert = function (expertID, iter) {
        if(absenceExperts[expertID] == undefined) {
            absenceExperts[expertID] = [];
        }
        absenceExperts[expertID].push(iter);
    };
    var delAbsenceExpert = function (expertID, iter) {
        absenceExperts[expertID] = absenceExperts[expertID].filter(function (x) {
            return x != iter;
        });
    };
    var isAbsenceExpert = function (expertID, iter) {
        return absenceExperts[expertID] != undefined && absenceExperts[expertID].indexOf(iter) != -1;
    };

    return {
        setAbsenceExpert: setAbsenceExpert,
        delAbsenceExpert: delAbsenceExpert,
        isAbsenceExpert: isAbsenceExpert
    };
});

pipePlannerApp.factory('timetable', function () {
    var options = {
        iterCount: 6
    };
    var getOptions = function () {
        return options;
    };

    return {
        getOptions: getOptions
    }
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

pipePlannerApp.controller("AbsenceExpertCtrl", function ($rootScope, $scope, experts, absenceExpert, timetable) {
    $scope.title = "Отсутствие экспертов";
    $scope.absenceExpertTable = {};
    $scope.iterCount = timetable.getOptions().iterCount;

    $scope.getExpertName = function (expertID) {
        return experts.getExpert(expertID).name;
    };

    $scope.updateTableFromModel = function () {
        for(var expertID in experts.getExperts()) {
            if($scope.absenceExpertTable[expertID] == undefined ||
               $scope.absenceExpertTable[expertID].length != timetable.getOptions().iterCount) {
                $scope.absenceExpertTable[expertID] = new Array(timetable.getOptions().iterCount);
            }

            for(var i = 0; i < timetable.getOptions().iterCount; i++) {
                $scope.absenceExpertTable[expertID][i] = (absenceExpert.isAbsenceExpert(expertID, i) ? 1 : 0);
            }
        }
    };

    $scope.onCellClick = function (expertID, iter) {
        if($scope.absenceExpertTable[expertID][iter] == 0) {
            absenceExpert.setAbsenceExpert(expertID, iter);
        } else {
            absenceExpert.delAbsenceExpert(expertID, iter);
        }
        $scope.updateTableFromModel();
    };

    $rootScope.$on("experts-updated", $scope.updateTableFromModel);
});

pipePlannerApp.controller("AbsenceTeamCtrl", function ($rootScope, $scope, teams, absenceTeam, timetable) {
    $scope.title = "Отсутствие команд";
    $scope.absenceTeamTable = {};
    $scope.iterCount = timetable.getOptions().iterCount;

    $scope.getTeamName = function (teamID) {
        return teams.getTeam(teamID).name;
    };

    $scope.updateTableFromModel = function () {
        for(var teamID in teams.getTeams()) {
            if($scope.absenceTeamTable[teamID] == undefined ||
                $scope.absenceTeamTable[teamID].length != timetable.getOptions().iterCount) {
                $scope.absenceTeamTable[teamID] = new Array(timetable.getOptions().iterCount);
            }

            for(var i = 0; i < timetable.getOptions().iterCount; i++) {
                $scope.absenceTeamTable[teamID][i] = (absenceTeam.isAbsenceTeam(teamID, i) ? 1 : 0);
            }
        }
    };

    $scope.onCellClick = function (teamID, iter) {
        if($scope.absenceTeamTable[teamID][iter] == 0) {
            absenceTeam.setAbsenceTeam(teamID, iter);
        } else {
            absenceTeam.delAbsenceTeam(teamID, iter);
        }
        $scope.updateTableFromModel();
    };

    $rootScope.$on("teams-updated", $scope.updateTableFromModel);
});