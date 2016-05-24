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