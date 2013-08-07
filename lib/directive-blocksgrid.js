(function () {


    angular.module('angular-blocksgrid')
        .directive("blocksgrid", function () {
            return {
                restrict: "E",
                template: "" +
                    "<div ng-repeat='row in grid' class='container_12'>" +
                        "<div class='row'>" +
                            "<div ng-repeat='column in row' class='grid_{{ 12 / row.length}}'>" +
                                "<div ng-repeat='block in column'>" +
                                    "<div draggable>{{ block.text }}</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>"
            };
    });
}());