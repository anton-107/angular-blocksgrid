(function () {


    angular.module('angular-blocksgrid')
        .directive("blocksgrid", function () {
            return {
                restrict: "E",
                template: "" +
                    "<div ng-repeat='row in grid' class='container_12 {{ dragState }}'>" +
                        "<div class='row' droppable ondropfinished='onBlockDropInRow(row)'>" +
                            "<div ng-repeat='column in row' class='grid_{{ 12 / row.length}}'>" +
                                "<div ng-repeat='block in column'>" +
                                    "<div class='draggable-block' draggable droppable ondragstarted='onBlockDrag(block)' droppable, ondropfinished='onBlockDrop(block)', data-hashkey='{{block.$$hashKey}}'>" +
                                        "<div ng-bind-html-unsafe='block.template'></div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='clearfix'></div>" +
                        "</div>" +
                    "</div>",
                controller: function ($scope) {
                    $scope.changeDragState = function (state) {
                        $scope.dragState = state;
                    }
                }
            };
    });
}());