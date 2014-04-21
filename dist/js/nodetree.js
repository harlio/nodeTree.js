/*
 *  jQuery NodeTree - v2.0.0
 *  A nested Checkbox Tree with Indeterminate prop and clean visual styles.
 *  http://jqueryboilerplate.com
 *
 *  Made by Harley Jessop
 *  Under MIT License
 */
/*
 *  jQuery NodeTree - v2.0.0
 *  A nested Checkbox Tree with Indeterminate prop and clean visual styles.
 *  http://jqueryboilerplate.com
 *
 *  Made by Harley Jessop
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

        // Create the defaults once
        var pluginName = "nodeTree",
            defaults = {
                treeSelector:           ".nt", // Wrapper of the entire nested list.
                nodeSelector:           ".nt__node", // Wrapper class given to each node in the tree
                branchSelector:         ".nt__branch", // Wrapper class given to each node in the tree
                checkAllSelector:       ".nt__check-all",
                uncheckAllSelector:     ".nt__uncheck-all",
                chopAllSelector:        ".nt__chop-all",
                growAllSelector:        ".nt__grow-all",
                growingClass:           "nt__node--growing",
                checkedClass:           "nt__node--checked",
                indeterminateClass:     "nt__node--indeterminate",
                iconSelector:           ".fa",
                growIconClass:          "fa-plus",
                chopIconClass:          "fa-minus",
                nodeInputSelector:      ".nt__node__input" // Active area on each node to display or hide nested nodes.
            };

        // The actual plugin constructor
        function Plugin ( element, options ) {
            this.element = element;
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }

        Plugin.prototype = {
            init: function () {
                // Place initialization logic here
                // You already have access to the DOM element and
                // the options via the instance, e.g. this.element
                // and this.settings
                // you can add more functions like the one below and
                // call them like so: this.yourOtherFunction(this.element, this.settings).
                var self = this,
                    def = this.settings,
                    container = this.element;

                // Make checkbox label not mess with the toggle function
                $(container).on("click", def.nodeInputSelector, function(e) {

                    e.stopPropagation();

                }).on("click", def.nodeSelector, function() {

                    if ($(this).siblings(def.branchSelector).length) {
                        $(this).toggleClass(def.growingClass);

                        self.toggleIcon($(this));
                    }

                }).on("click", def.checkAllSelector, function() {

                    $(container).find(":checkbox")
                        .prop({checked: "checked", indeterminate: false })
                        .trigger("change");

                }).on("click", def.uncheckAllSelector, function() {

                    $(container).find(":checkbox")
                        .removeAttr("checked")
                        .trigger("change");

                }).on("click", def.growAllSelector, function() {

                    $(container).find(def.nodeSelector).each(function(){

                        if ($(this).siblings(def.branchSelector).length) {
                            $(this).addClass(def.growingClass);
                            self.toggleIcon($(this));
                        }
                    });

                }).on("click", def.chopAllSelector, function() {

                    $(container).find(def.nodeSelector).each(function(){
                        $(this).removeClass(def.growingClass);
                        self.toggleIcon($(this));
                    });

                }).on("change", ":checkbox", function(e) {

                    e.stopPropagation();
                    var checked = $(this).prop("checked"),
                        nodeContainer = $(this.parentNode.parentNode.parentNode),
                        descendantNodes;

                    descendantNodes = $(nodeContainer).find(":checkbox");

                    descendantNodes.prop({
                        indeterminate: false,
                        checked: checked
                    });

                    self.colorCoded(this);
                    self.colorCoded(descendantNodes);

                    if (!nodeContainer.parent().parent().hasClass("nt__trunk")){
                        self.checkSiblings(nodeContainer, checked);
                    }

                });

                // Called on init to hanlde pre checked nodes on page load
                // nodeDepth should be passed in as an option to the deepest level expected in the list
                self.checkSiblings($(container).find(":checked").closest("li"), true);

            },

            colorCoded: function (n) {

                var def = this.settings;

                $(n).each(function(){
                    $(this).closest(def.nodeSelector)
                        .toggleClass(def.checkedClass, $(n).is(":checked"))
                        .toggleClass(def.indeterminateClass, $(n).prop("indeterminate") === true);
                });
            },

            toggleIcon: function (n) {

                var def = this.settings;

                // Change the icon.
                if (n.hasClass(def.growingClass)) {
                    // The user wants to collapse the child list.
                    n.find(def.iconSelector).removeClass(def.growIconClass).addClass(def.chopIconClass);
                } else {
                    // The user wants to expand the child list.
                    n.find(def.iconSelector).removeClass(def.chopIconClass).addClass(def.growIconClass);
                }
            },

            checkSiblings: function (el, checked) {

                if (!el.length){
                    return;
                }

                var self = this,
                    def = this.settings,
                    parent = el.parent().parent(),
                    all = true,
                    thisNode;

                thisNode = parent.children(def.nodeSelector).find(":checkbox");

                el.siblings().not(".empty").each(function() {
                    return all = ($(this).find(":checkbox").prop("checked") === checked);
                });

                if (all && checked) {

                    $(":checkbox", parent).prop({
                        indeterminate: false,
                        checked: checked
                    });
                    self.colorCoded(thisNode);
                    self.checkSiblings(parent, checked);

                } else if (all && !checked) {

                    thisNode.prop("checked", checked);
                    thisNode.prop("indeterminate", (parent.find(":checked").length));
                    self.colorCoded(thisNode);
                    self.checkSiblings(parent, checked);

                } else {

                    el.parents("li").children(def.nodeSelector).find(":checkbox").prop({
                        indeterminate: true,
                        checked: false
                    });
                    self.colorCoded(el.parents("li").children(def.nodeSelector).find(":checkbox"));

                }
            }
        };

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options ) {

            this.each(function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                }
            });

            // chain jQuery functions
            return this;
        };

})( jQuery, window, document );

