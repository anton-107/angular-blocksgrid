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