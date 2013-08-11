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