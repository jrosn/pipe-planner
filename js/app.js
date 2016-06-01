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

pipePlannerApp.factory('timetable', function ($rootScope, experts) {
    var iterCount = 10;
    var getIterCount = function () {
        return iterCount;
    };
    var setIterCount = function (newVal) {
        iterCount = newVal;
        $rootScope.$broadcast("timetable-itercount-updated");
    };

    var timetable = {};
    var addTeamToCell = function (expertID, iter, teamID) {
        if(timetable[expertID] == undefined) {
            timetable[expertID] = new Array(iterCount);
        }

        timetable[expertID][iter] = teamID;
    };
    var getTeamFromCell = function (expertID, iter) {
        if(timetable[expertID] == undefined) {
            return undefined;
        }

        return timetable[expertID][iter];
    };
    var clear = function () {
        timetable = {}
    };

    var isDublicatedInIter = function (iter, teamID) {
        for(var expertID in experts.getExperts()) {
            if(getTeamFromCell(expertID, iter) == teamID) {
                return true;
            }
        }
        return false;
    };

    return {
        getIterCount: getIterCount,
        setIterCount: setIterCount,
        addTeamToCell: addTeamToCell,
        getTeamFromCell: getTeamFromCell,
        isDuplicatedInIter: isDublicatedInIter,
        clear: clear
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

pipePlannerApp.controller("AbsenceExpertCtrl", function ($rootScope, $scope, experts, absenceExpert, timetable) {
    $scope.title = "Отсутствие экспертов";
    $scope.absenceExpertTable = {};
    $scope.iterCount = timetable.getIterCount();

    $scope.getExpertName = function (expertID) {
        return experts.getExpert(expertID).name;
    };

    $scope.updateTableFromModel = function () {
        for(var expertID in experts.getExperts()) {
            if($scope.absenceExpertTable[expertID] == undefined ||
               $scope.absenceExpertTable[expertID].length != timetable.getIterCount()) {
                $scope.absenceExpertTable[expertID] = new Array(timetable.getIterCount());
            }

            for(var i = 0; i < timetable.getIterCount(); i++) {
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
    $rootScope.$on("timetable-itercount-updated", $scope.updateTableFromModel);
});

pipePlannerApp.controller("AbsenceTeamCtrl", function ($rootScope, $scope, teams, absenceTeam, timetable) {
    $scope.title = "Отсутствие команд";
    $scope.absenceTeamTable = {};
    $scope.iterCount = timetable.getIterCount();

    $scope.getTeamName = function (teamID) {
        return teams.getTeam(teamID).name;
    };

    $scope.updateTableFromModel = function () {
        for(var teamID in teams.getTeams()) {
            if($scope.absenceTeamTable[teamID] == undefined ||
                $scope.absenceTeamTable[teamID].length != timetable.getIterCount()) {
                $scope.absenceTeamTable[teamID] = new Array(timetable.getIterCount());
            }

            for(var i = 0; i < timetable.getIterCount(); i++) {
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
    $rootScope.$on("timetable-itercount-updated", $scope.updateTableFromModel);
});

pipePlannerApp.controller("TimetableCtrl", function ($rootScope, $scope, timetable, experts, teams, absenceTeam, absenceExpert) {
    $scope.timetableTable = {};

    $scope.updateTableFromModel = function () {
        for(var expertID in experts.getExperts()) {
            if($scope.timetableTable[expertID] == undefined ||
               $scope.timetableTable[expertID].length != timetable.getIterCount()) {
                $scope.timetableTable[expertID] = new Array(timetable.getIterCount());
            }

            for(var i = 0; i < timetable.getIterCount(); i++) {
                $scope.timetableTable[expertID][i] = timetable.getTeamFromCell(expertID, i);
            }
        }
    };

    $scope.autoFillTable = function () {
        timetable.clear();

        var teamIDs = [];
        var expertsInTeams = {};
        for(var teamID in teams.getTeams()) {
            teamIDs.push(teamID);
            expertsInTeams[teamID] = [];
        }
        if(teamIDs.length == 0) {
            return;
        }

        for(var expertID in experts.getExperts()) {
            for(var iter = 0; iter < timetable.getIterCount(); iter++) {
                if(absenceExpert.isAbsenceExpert(expertID, iter)) {
                    continue;
                }

                var selTeamID = undefined;
                for(var j = 0; j < 3 * teamIDs.length; j++) {
                    var jNormalized = j % teamIDs.length;
                    if(!absenceTeam.isAbsenceTeam(teamIDs[jNormalized], iter) &&
                       !timetable.isDuplicatedInIter(iter, teamIDs[jNormalized]) &&
                       expertsInTeams[teamIDs[jNormalized]].indexOf(expertID) == -1) {
                        selTeamID = teamIDs[jNormalized];
                        break;
                    }
                }

                if(selTeamID != undefined) {
                    timetable.addTeamToCell(expertID, iter, selTeamID);
                    expertsInTeams[selTeamID].push(expertID)
                }
            }
        }

        $scope.updateTableFromModel();
    };

    $scope.getExpertName = function (expertID) {
        if(expertID == undefined) return "";
        return experts.getExpert(expertID).name;
    };

    $scope.getTeamName = function (teamID) {
        if(teamID == undefined) return "";
        return teams.getTeam(teamID).name;
    };

    $scope.setIterCount = timetable.setIterCount;

    $rootScope.$on("teams-updated", $scope.updateTableFromModel);
    $rootScope.$on("experts-updated", $scope.updateTableFromModel);
    $rootScope.$on("timetable-itercount-updated", $scope.updateTableFromModel);
    $scope.$watch("iterCountForm", timetable.setIterCount);
});