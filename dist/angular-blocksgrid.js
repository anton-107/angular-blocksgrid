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
(function () {


    angular.module('angular-blocksgrid')
        .directive("draggable", function () {
            return {
                restrict: "A",
                link: function ($scope, elem, attrs) {

                    // create a handle:
                    var dragHandle = document.createElement("div");
                    dragHandle.className = "drag-handle";

                    elem.append(dragHandle);
                    elem.attr("draggable", true);
                    elem.addClass("draggable-block");

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
                        $scope.$apply(attrs.ondragstarted);

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
                        $scope.$apply(attrs.ondropfinished);
                    });

                }
            };
        });
}());
(function () {
    "use strict";


    angular.module('angular-blocksgrid')
        .directive("droppable", function ($compile) {
            return {
                restrict: "A",
                link: function (scope, elem, attr) {

                    // Set dropzones highlighting and positioning
                    elem.addClass("has-dropzones");

                    /**
                     * small helper for turning strings like 'myMethod(block)' to 'myMethod(block, "bottom")' (the same goes for 'row' argument)
                     * @private
                     * @param handlerText
                     * @param direction
                     * @returns {string}
                     */
                    var setHandlersDirection = function (handlerText, direction) {
                        return String(handlerText).replace("(block)", "(block, \"" + direction + "\")").replace("(row)", "(row, \"" + direction + "\")");
                    };

                    /**
                     *
                     * @param attr
                     * @param direction
                     * @returns {string} Dropzone element template
                     */
                    var dropZoneTemplate = function (attr, direction) {
                        return "<div dropzone class='dropzone dropzone-" + direction + "' ondropfinished='" + setHandlersDirection(attr.ondropfinished, direction) + "' ></div>";
                    };

                    //
                    // Insert dropzone elements to target element:
                    //

                    var topDropZone = $compile(dropZoneTemplate(attr, "top"))(scope);
                    var bottomDropZone = $compile(dropZoneTemplate(attr, "bottom"))(scope);
                    var leftDropZone = $compile(dropZoneTemplate(attr, "left"))(scope);
                    var rightDropZone = $compile(dropZoneTemplate(attr, "right"))(scope);

                    elem.append(topDropZone);
                    elem.append(bottomDropZone);
                    elem.append(leftDropZone);
                    elem.append(rightDropZone);
                }
            };
        });

}());
(function () {
    "use strict";


    angular.module('angular-blocksgrid')
        .directive("dropzone", function ($compile) {
            return {
                restrict: "A",
                link: function (scope, elem, attrs) {

                    //
                    // Highlight active dropzone
                    //

                    elem.bind("dragover", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        elem.addClass("over");
                    });

                    elem.bind("dragleave", function () {
                        elem.removeClass("over");
                    });

                    //
                    // Trigger drop handler and darken the dropzone
                    //

                    elem.bind("drop", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        scope.$apply(attrs.ondropfinished);
                        elem.removeClass("over");
                    });
                }

            }
        });

}());
(function () {
    "use strict";

    var $dragAndDrop = function ($rootElement) {

        var bodyClassWhileDragging = "state-dragmode";
        var blockClassWhileDragging = "state-isdragged";

        /**
         * When user starts dragging a block, it should be put to blockInTransit state
         * @type {Object}
         */
        var blockInTransit = null;

        this.setBlockInTransit = function ($scope, block) {
            blockInTransit = block;

            // highlight dropzones of other elements:
//            $rootElement.addClass(bodyClassWhileDragging);
            $scope.changeDragState(bodyClassWhileDragging);

            // turn off dropzones of element in transit
            var el = $rootElement[0].querySelectorAll(".draggable-block[data-hashkey='" + blockInTransit.$$hashKey + "']");
            angular.element(el[0]).addClass(blockClassWhileDragging);
        };

        /**
         * When user completes a drop, the blockInTransit should be moved next to targetBlock (on the side of dropZone)
         * @param targetBlock
         * @param dropZone
         * @param $blocksgridModel
         */
        this.completeDrop = function ($scope, $blocksgridModel, targetBlock, dropZone) {
            // remove highlighting of all dropzones:
            $scope.changeDragState("");

            if (blockInTransit !== null) {
                // return dropzones of element in transit
                var el = $rootElement[0].querySelectorAll(".dragabble-block[data-hashkey='" + blockInTransit.$$hashKey + "']");
                angular.element(el).removeClass(blockClassWhileDragging);

                if (targetBlock !== null && blockInTransit !== targetBlock) {

                    var isInsertSuccess = false;

                    switch (dropZone) {
                        case 'top':
                            isInsertSuccess = $blocksgridModel.insertAbove(targetBlock, blockInTransit, true);
                            break;
                        case 'bottom':
                            isInsertSuccess = $blocksgridModel.insertBelow(targetBlock, blockInTransit, true);
                            break;
                        case 'left':
                            isInsertSuccess = $blocksgridModel.insertAsideLeft(targetBlock, blockInTransit, true);
                            break;
                        case 'right':
                            isInsertSuccess = $blocksgridModel.insertAsideRight(targetBlock, blockInTransit, true);
                            break;
                    }

                    if (isInsertSuccess) {
                        $blocksgridModel.cleanEmptyCells();
                        $blocksgridModel.cleanEmptyRows();
                    }

                }

                blockInTransit = null;
            }
        };

        this.completeDropInRow = function($scope, $blocksgridModel, targetRow, dropZone) {
            // remove highlighting of all dropzones:
            $scope.changeDragState("");

            if (blockInTransit !== null) {

                if (targetRow !== null) {

                    var isInsertSuccess = false;

                    switch (dropZone) {
                        case 'top':
                            isInsertSuccess = $blocksgridModel.insertAboveRow(targetRow, blockInTransit, true);
                            break;
                        case 'bottom':
                            isInsertSuccess = $blocksgridModel.insertBelowRow(targetRow, blockInTransit, true);
                            break;
                    }

                    if (isInsertSuccess) {
                        $blocksgridModel.cleanEmptyCells();
                        $blocksgridModel.cleanEmptyRows();
                    }

                }

                blockInTransit = null;
            }
        };

    };


    angular.module('angular-blocksgrid')
        .service('$dragAndDrop', $dragAndDrop);

}());
(function () {

    var $gridProvider = function () {

        this.$get = $get;
        $get.$inject = ['$blocksgridModel', '$dragAndDrop', '$controller'];

        function $get($blocksgridModelProvider, $dragAndDrop, $controller) {
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
                        $dragAndDrop.setBlockInTransit($scope, movedBlock);
                    };

                    $scope.onBlockDrop = function (targetBlock, dropZone) {
                        $dragAndDrop.completeDrop($scope, $blocksgridModel, targetBlock, dropZone);
                    };
                    $scope.onBlockDropInRow = function (targetRow, dropZone) {
                        $dragAndDrop.completeDropInRow($scope, $blocksgridModel, targetRow, dropZone);
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
        this.maximumNumberOfColumns = 4;
    };

    BlocksgridCollection.prototype = {
        addBlock: function (block) {
            this.data.push([
                [
                    block
                ]
            ]);
        },

        findRow: function (block) {

           var data = this.data;

            for (var i = 0, l = data.length; i < l; i++) {
                for (var j = 0, l2 = data[i].length; j < l2; j++) {
                    for (var k = 0, l3 = data[i][j].length; k < l3; k++) {
                        var b = data[i][j][k];
                        if (b === block) {
                            return data[i];
                        }
                    }
                }
            }

            return null;
        },

        findBlockCoordinates: function (block) {

            var data = this.data;

            for (var i = 0, l = data.length; i < l; i++) {
                for (var j = 0, l2 = data[i].length; j < l2; j++) {
                    for (var k = 0, l3 = data[i][j].length; k < l3; k++) {
                        var b = data[i][j][k];
                        if (b === block) {
                            return [i, j, k];
                        }
                    }
                }
            }

            return null;
        },

        /**
         * @private
         * @param row
         * @returns Number
         */
        getRowIndex: function (row) {

            for (var i = 0, l = this.data.length; i < l; i++) {
                if (this.data[i] === row) {
                    return i;
                }
            }

            return null;
        },

        removeBlock: function (block) {
            var coords = this.findBlockCoordinates(block);

            if (coords !== null) {
                this.data[coords[0]][coords[1]].splice(coords[2], 1);
            }

        },


        /**
         * Remove empty rows from content
         * @private
         *
         */
        cleanEmptyRows: function () {

            var data = this.data;

            var i = data.length;
            while (i--) {
                if (data[i].length === 0) {
                    data.splice(i, 1);
                }
            }
        },

        /**
         * Remove empty cells from content
         * @private
         *
         */
        cleanEmptyCells: function () {

            var data = this.data;

            for (var i = 0, l = data.length; i < l; i++) {
                var j = data[i].length;
                while (j--) {
                    if (data[i][j].length === 0) {
                        data[i].splice(j, 1);
                    }
                }
            }

        },

        /**
         * Insert a blockToInsert into the new row on top of targetBlock
         * @public
         * @param targetBlock
         * @param blockToInsert
         * @param removeFirstIfExists
         * @return boolean - true if operation was successful
         */
        insertAbove: function (targetBlock, blockToInsert, removeFirstIfExists) {
            var coords = this.findBlockCoordinates(targetBlock);

            if (coords !== null) {
                if (removeFirstIfExists) {
                    this.removeBlock(blockToInsert);
                }
                this.data[coords[0]][coords[1]].splice(coords[2], 0, blockToInsert);
            }

            return true;

        },

        /**
         * Insert a blockToInsert into the new row on bottom of targetBlock
         * @public
         * @param targetBlock
         * @param blockToInsert
         * @param removeFirstIfExists
         * @return boolean - true if operation was successful
         */
        insertBelow: function (targetBlock, blockToInsert, removeFirstIfExists) {
            var coords = this.findBlockCoordinates(targetBlock);

            if (coords !== null) {
                if (removeFirstIfExists) {
                    this.removeBlock(blockToInsert);
                }
                this.data[coords[0]][coords[1]].splice(coords[2] + 1, 0, blockToInsert);
            }

            return true;

        },


        /**
         * Insert a blockToInsert into the same row before targetBlock
         * @public
         * @param targetBlock
         * @param blockToInsert
         * @param removeFirstIfExists
         * @return boolean - true if operation was successful
         */
        insertAsideLeft: function (targetBlock, blockToInsert, removeFirstIfExists) {
            var row = this.findRow(targetBlock);

            if (row !== null && row.length < this.maximumNumberOfColumns) {
                var coords = this.findBlockCoordinates(targetBlock);

                if (coords !== null) {
                    if (removeFirstIfExists) {
                        this.removeBlock(blockToInsert);
                    }
                    this.data[coords[0]].splice(coords[1], 0, [blockToInsert]);
                    return true;
                }
            }

            return false;

        },

        /**
         * Insert a blockToInsert into the same row after targetBlock
         * @public
         * @param targetBlock
         * @param blockToInsert
         * @param removeFirstIfExists
         * @return boolean - true if operation was successful
         */
        insertAsideRight: function (targetBlock, blockToInsert, removeFirstIfExists) {
            var row = this.findRow(targetBlock);

            if (row !== null && row.length < this.maximumNumberOfColumns) {
                var coords = this.findBlockCoordinates(targetBlock);

                if (coords !== null) {
                    if (removeFirstIfExists) {
                        this.removeBlock(blockToInsert);
                    }
                    this.data[coords[0]].splice(coords[1] + 1, 0, [blockToInsert]);
                    return true;
                }
            }

            return false;
        },


        /**
         * Insert a blockToInsert into the new row on top of targetRow
         * @public
         * @param targetRow
         * @param blockToInsert
         * @param removeFirstIfExists
         * @return boolean - true if operation was successful
         */
        insertAboveRow: function (targetRow, blockToInsert, removeFirstIfExists) {
            var i = this.getRowIndex(targetRow);

            if (i !== null) {
                if (removeFirstIfExists) {
                    this.removeBlock(blockToInsert);
                }
                this.data.splice(i, 0, [[blockToInsert]]);
            }

            return true;
        },
        /**
         * Insert a blockToInsert into the new row on bottom of targetRow
         * @public
         * @param targetRow
         * @param blockToInsert
         * @param removeFirstIfExists
         * @return boolean - true if operation was successful
         */
        insertBelowRow: function (targetRow, blockToInsert, removeFirstIfExists) {
            var i = this.getRowIndex(targetRow);

            if (i !== null) {
                if (removeFirstIfExists) {
                    this.removeBlock(blockToInsert);
                }
                this.data.splice(i + 1, 0, [[blockToInsert]]);
            }

            return true;
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