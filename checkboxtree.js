/**
** checkboxtree 1.3
** No copyrights or licenses.
** @author:     @harleyjessop
** @repository: https://github.com/harleyjessop/checkboxtree.js
**
**/

;(function ( $, window, document, undefined ) {

		// Create the defaults once
		var pluginName = "checkboxtree",
				defaults = {
                tree:           '.tree', // Wrapper of the entire nested list.
                node:           '.node', // Wrapper class given to each node in the tree	
                nodeBtnLabel:   '.node label', // Active area on each node to display or hide nested nodes.
                nodeDepth:      '.greatgrandchild' // Default dept of tree lists		
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
                        container = this.element;

                    $(self.settings.node, self.settings.tree).click(function() {

                        if ($(this).siblings('.node-list').length) {
                            $(this).parent().toggleClass('active');
                            self.toggleIcon($(this));
                        }
                    });
            
                    $(container).on('click', '.check-all-nodes', function() {

                        $(self.settings.tree + ' :checkbox')
                            .prop({checked: 'checked', indeterminate: false })
                            .trigger('change');
                        self.colorCoded();

                    }).on('click', '.uncheck-all-nodes', function() {

                        $(self.settings.tree + ' :checkbox')
                            .removeAttr('checked')
                            .trigger('change');
                        self.colorCoded();

                    }).on('click', '.expand-all-nodes', function() {

                        $(self.settings.node, self.settings.tree).each(function(){

                            if ($(this).siblings('.node-list').length) {
                                $(this).parent().addClass('active');
                                self.toggleIcon($(this));
                            }
                        });

                    }).on('click', '.collapse-all-nodes', function() {

                        $(self.settings.node, self.settings.tree).each(function(){
                            $(this).parent().removeClass('active');
                            self.toggleIcon($(this));
                        });

                    });
            
                    // Make checkbox label not mess with the toggle function
                    $(self.settings.nodeBtnLabel).on('click', function(e) {
                        e.stopPropagation();
                    });
            
                    $(':checkbox', self.settings.tree).on('change', function(e) {

                        e.stopPropagation();
                        var checked = $(this).prop("checked");
                        var nodeContainer = $(this.parentNode.parentNode.parentNode);
                        var descendantNodes = $(':checkbox', nodeContainer).not($('.added :checked'));

                        descendantNodes.prop({
                            indeterminate: false,
                            checked: checked
                        });

                        self.colorCoded(descendantNodes);
                        if (!nodeContainer.parent('.parent-list').length){
                            self.checkSiblings(nodeContainer, checked);
                        }
                        self.colorCoded(this);

                    });

                    // Called on init to hanlde pre checked nodes on page load
                    self.checkSiblings($(self.settings.nodeDepth + ' :checked').closest('li'), true);

				},

				colorCoded: function (n) {

                    var self = this;
                    $(n).each(function(){
                        $(this).closest(self.settings.node)
                            .toggleClass('checked', $(n).is(':checked'))
                            .toggleClass('indeterminate', $(n).prop("indeterminate") === true);
                    });
				},

                toggleIcon: function (n) {
                    // Change the icon.
                    if (n.parent().hasClass('active')) {
                        // The user wants to collapse the child list.
                        n.find('i').removeClass('icon-plus-sign').addClass('icon-minus-sign');
                    } else {
                        // The user wants to expand the child list.
                        n.find('i').removeClass('icon-minus-sign').addClass('icon-plus-sign');
                    }
                },

                checkSiblings: function (el, checked) {

                    if (!el.length) return;

                    var self = this,
                        parent = el.parent().parent(),
                        all = true;

                    var thisNode = parent.children(self.settings.node).find(':checkbox');

                    el.siblings().not('.empty').each(function() {
                        return all = ($(this).find(':checkbox').prop("checked") === checked);
                    });

                    if (all && checked) {

                        $(':checkbox', parent).prop({
                            indeterminate: false,
                            checked: checked
                        });
                        self.colorCoded(thisNode);
                        self.checkSiblings(parent, checked);

                    } else if (all && !checked) {

                        thisNode.prop("checked", checked);
                        thisNode.prop("indeterminate", (parent.find(':checked').length));
                        self.colorCoded(thisNode);
                        self.checkSiblings(parent, checked);

                    } else {

                        el.parents("li").children(self.settings.node).find(':checkbox').prop({
                            indeterminate: true,
                            checked: false
                        });
                        self.colorCoded(el.parents("li").children(self.settings.node).find(':checkbox'));

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

