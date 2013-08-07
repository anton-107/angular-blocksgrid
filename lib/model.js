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