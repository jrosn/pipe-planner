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
    var _data = {};

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

pipePlannerApp.factory('absenseTeam', function (teams) {
    var absenseTeams = {};
    var setAbsenseTeam = function (teamID, iter) {
        if(absenseTeams[teamID] == undefined) {
            absenseTeams[teamID] = [];
        }
        absenseTeams[teamID].push(iter);
    };
    var delAbsenseTeam = function (teamID, iter) {
        absenseTeams[teamID] = absenseTeams[teamID].filter(function (x) {
            return x != iter;
        });
    };
    var isAbsenseTeam = function (teamID, iter) {
        return absenseTeams[teamID] != undefined && absenseTeams[teamID].indexOf(iter) != -1;
    };
    return {
        setAbsenseTeam: setAbsenseTeam,
        delAbsenseTeam: delAbsenseTeam,
        isAbsenseTeam: isAbsenseTeam
    }
});

pipePlannerApp.factory('absenseExpert', function (experts) {
    var absenseExperts = {};
    var setAbsenseExpert = function (expertID, iter) {
        if(absenseExperts[expertID] == undefined) {
            absenseExperts[expertID] = [];
        }
        absenseExperts[expertID].push(iter);
    };
    var delAbsenseExpert = function (expertID, iter) {
        absenseExperts[expertID] = absenseExperts[expertID].filter(function (x) {
            return x != iter;
        });
    };
    var isAbsenseExpert = function (expertID, iter) {
        return absenseExperts[expertID] != undefined && absenseExperts[expertID].indexOf(iter) != -1;
    };

    return {
        setAbsenseExpert: setAbsenseExpert,
        delAbsenseExpert: delAbsenseExpert,
        isAbsenseExpert: isAbsenseExpert
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