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