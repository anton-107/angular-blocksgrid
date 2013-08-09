/*!
 * angular-blocksgrid - AngularJS directive for creating grids and allowing users to drag-and-drop elements of this grid
 * v0.1.0
 * 
 * copyright Anton Nekipelov 2013
 * MIT License
*/
(function () {

    angular.module('angular-blocksgrid', []);

}());
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
(function () {


    angular.module('angular-blocksgrid')
        .directive("draggable", function () {
            return {
                restrict: "A",
                link: function (scope, elem, attrs) {

                    var dragHandle = document.createElement("div");
                    dragHandle.className = "drag-handle";

                    elem.append(dragHandle);
                    elem.attr("draggable", true);

                    // create a handle:
//                    var dragHandle = $(elem[0]).find(".drag-handle").get(0);

                    // detect the original target of a drag:
                    var mouseDownTarget = false;
                    elem.bind("mousedown", function(e) {
                        mouseDownTarget = e.target;
                    });

                    elem.bind("dragstart", function (e) {
                        // only drag if it is dragged by a handle:
                        if (!dragHandle.contains(mouseDownTarget)) {
                            e.preventDefault();
                            return;
                        }

                        // make it work in firefox:
                        if (e.dataTransfer && e.dataTransfer.setData) {
                            e.dataTransfer.setData('text/plain', 'This text may be dragged');
                        }

                        // call the angularjs handler:
                        scope.$apply(attrs.ondragstarted);

                    });

                    elem.bind('selectstart', function(){
                        // make it work in ie:
                        if (this.dragDrop) {
                            this.dragDrop();
                        }
                        return false;
                    });

                    elem.bind("dragend", function () {
                        // call the angularjs handler:
                        scope.$apply(attrs.ondropfinished);
                    });

                }
            };
        });
}());
(function () {

    var $gridProvider = function () {

        this.$get = $get;
        $get.$inject = ['$blocksgridModel'];

        function $get($blocksgridModelProvider) {
            return {
                init: function ($scope) {
                    var $blocksgridModel = $blocksgridModelProvider($scope.$id);

                    // Expose data for building the dom tree:
                    $scope.grid = $blocksgridModel.data;

                    $scope.addBlockToGrid = function (block) {
                        $blocksgridModel.addBlock.call($blocksgridModel, block);
                    };

                    //
                    // Set up drag and drop:
                    //
                    $scope.onBlockDrag = function (movedBlock) {
                        dragAndDrop.setBlockInTransit(movedBlock);
                    };

                    $scope.onBlockDrop = function (targetBlock, dropZone) {
                        dragAndDrop.completeDrop(targetBlock, dropZone);
                    };
                    $scope.onBlockDropInRow = function (targetRow, dropZone) {
                        dragAndDrop.completeDropInRow(targetRow, dropZone);
                    };

                    // show initial temporary content:
//                    $blocksgridModel.addBlock();
//                    $blocksgridModel.addBlock();
                }
            };
        }
    };

    angular.module('angular-blocksgrid')
        .provider('$blocksgrid', $gridProvider);

}());
(function () {

    var BlocksgridCollection = function () {
        this.data = [];
    };

    BlocksgridCollection.prototype = {
        addBlock: function (block) {
            this.data.push([
                [
                    block
                ]
            ]);
        }
    };

    var $gridModelProvider = function () {

        var instances = {};

        this.$get = $get;

        function $get() {
            return function (scopeId) {
                if (!instances[scopeId]) {
                    instances[scopeId] = new BlocksgridCollection();
                }
                return instances[scopeId];
            };

        }
    };

    angular.module('angular-blocksgrid')
        .provider('$blocksgridModel', $gridModelProvider);

}());