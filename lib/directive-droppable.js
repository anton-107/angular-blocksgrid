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