/*
 *  jQuery NodeTree - v2.0.2
 *  A nested Checkbox Tree with Indeterminate prop and clean visual styles.
 *
 *  Made by Harley Jessop
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

        // Create the defaults once
        var pluginName = "nodeTree",
            defaults = {
                treeSel:           ".nt", // Wrapper of the entire nested list.
                nodeSel:           ".nt__node", // Wrapper class given to each node in the tree
                branchSel:         ".nt__branch", // Wrapper class given to each node in the tree
                trunkCls:          "nt__trunk",
                checkAllSel:       ".nt__check-all",
                uncheckAllSel:     ".nt__uncheck-all",
                chopAllSel:        ".nt__chop-all",
                growAllSel:        ".nt__grow-all",
                growingCls:        "nt__node--growing",
                checkedCls:        "nt__node--checked",
                indeterminateCls:  "nt__node--indeterminate",
                iconSel:           ".fa",
                growIconCls:       "fa-plus",
                chopIconCls:       "fa-minus",
                nodeInputSel:      ".nt__node__input" // Active area on each node to display or hide nested nodes.
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
                $(container).on("click", def.nodeInputSel, function(e) {

                    e.stopPropagation();

                }).on("click", def.nodeSel, function() {

                    if ($(this).siblings(def.branchSel).length) {
                        $(this).toggleClass(def.growingCls);

                        self.toggleIcon($(this));
                    }

                }).on("click", def.checkAllSel, function() {

                    $(container).find(":checkbox")
                        .prop({checked: "checked", indeterminate: false })
                        .trigger("change");

                }).on("click", def.uncheckAllSel, function() {

                    $(container).find(":checkbox")
                        .removeAttr("checked")
                        .trigger("change");

                }).on("click", def.growAllSel, function() {

                    $(container).find(def.nodeSel).each(function(){

                        if ($(this).siblings(def.branchSel).length) {
                            $(this).addClass(def.growingCls);
                            self.toggleIcon($(this));
                        }
                    });

                }).on("click", def.chopAllSel, function() {

                    $(container).find(def.nodeSel).each(function(){
                        $(this).removeClass(def.growingCls);
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

                    self.paint(this);
                    self.paint(descendantNodes);

                    if (!nodeContainer.parent().parent().hasClass(def.trunkCls)){
                        self.checkSib(nodeContainer, checked);
                    }

                });

                // Called on init to hanlde pre checked nodes on page load
                $(container).find(":checked").change();

            },

            paint: function (n) {

                var def = this.settings;

                $(n).each(function(){
                    $(this).closest(def.nodeSel)
                        .toggleClass(def.checkedCls, $(n).is(":checked"))
                        .toggleClass(def.indeterminateCls, $(n).prop("indeterminate") === true);
                });
            },

            toggleIcon: function (n) {

                var def = this.settings;

                // Change the icon.
                if (n.hasClass(def.growingCls)) {
                    // The user wants to collapse the child list.
                    n.find(def.iconSel).removeClass(def.growIconCls).addClass(def.chopIconCls);
                } else {
                    // The user wants to expand the child list.
                    n.find(def.iconSel).removeClass(def.chopIconCls).addClass(def.growIconCls);
                }
            },

            checkSib: function (el, checked) {

                if (!el.length){
                    return;
                }

                var self = this,
                    def = this.settings,
                    parent = el.parent().parent(),
                    all = true,
                    thisNode;

                thisNode = parent.children(def.nodeSel).find(":checkbox");

                el.siblings().not(".empty").each(function() {
                    return all = ($(this).find(":checkbox").prop("checked") === checked);
                });

                if (all && checked) {

                    $(":checkbox", parent).prop({
                        indeterminate: false,
                        checked: checked
                    });
                    self.paint(thisNode);
                    self.checkSib(parent, checked);

                } else if (all && !checked) {

                    thisNode.prop("checked", checked);
                    thisNode.prop("indeterminate", (parent.find(":checked").length));
                    self.paint(thisNode);
                    self.checkSib(parent, checked);

                } else {

                    el.parents("li").children(def.nodeSel).find(":checkbox").prop({
                        indeterminate: true,
                        checked: false
                    });
                    self.paint(el.parents("li").children(def.nodeSel).find(":checkbox"));

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

