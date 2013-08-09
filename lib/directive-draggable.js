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
                    elem.addClass("draggable-block");

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