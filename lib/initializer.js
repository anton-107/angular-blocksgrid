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