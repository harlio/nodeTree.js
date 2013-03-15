(function($) {
    $.fn.boxtree = function(options){
        // default configuration properties
        var defaults = {
            container:      this,
            tree:           '.tree', // Wrapper of the entire nested list.
            node:           '.node', // Wrapper class given to each node in the tree	
            nodeBtnLabel:   '.node label', // Active area on each node to display or hide nested nodes.
            nodeDepth:      '.greatgrandchild' // Default dept of tree lists		
        };

        var options = $.extend(defaults, options);

        $(options.node, options.tree).click(function() {
            if (!$(this).is(options.nodeDepth)){
                $(this).parent().toggleClass('active');
                _toggleIcon($(this));
            }
        });

        options.container.on('click', '.check-all-nodes', function() {
            $(options.tree + ' :checkbox').not($('.added ' +  options.node + ' :checkbox')).attr('checked', 'checked').trigger('change');
            colorCoded();
        }).on('click', '.uncheck-all-nodes', function() {
            $(options.tree + ' :checkbox').not($('.added ' +  options.node + ' :checkbox')).removeAttr('checked').trigger('change');
            colorCoded();
        }).on('click', '.expand-all-nodes', function() {
            $(options.node, options.tree).each(function(){
                $(this).parent().addClass('active');
                $(options.nodeDepth).parent().removeClass('active');
                _toggleIcon($(this));
            });
        }).on('click', '.collapse-all-nodes', function() {
            $(options.node, options.tree).each(function(){
                $(this).parent().removeClass('active');
                _toggleIcon($(this));
            });
        });

        // Make checkbox label not mess with the toggle function
        $(options.nodeBtnLabel).on('click', function(e) {
            e.stopPropagation();
        });

        $(':checkbox', options.tree).on('change', function(e) {
            e.stopPropagation();
            var checked = $(this).prop("checked");
            var nodeContainer = $(this.parentNode.parentNode.parentNode);
            var descendantNodes = $(':checkbox', nodeContainer).not($('.added :checked'));
            descendantNodes.prop({
                indeterminate: false,
                checked: checked
            });
            colorCoded(descendantNodes);
            if (!nodeContainer.parent('#parent-list').length){
                checkSiblings(nodeContainer, checked);
            }
            colorCoded(this);
        });

        function colorCoded(n){
            $(n).each(function(){
                $(this).closest(options.node)
                .toggleClass('checked', $(n).is(':checked'))
                .toggleClass('indeterminate', $(n).prop("indeterminate") === true);
            });
        }

        function _toggleIcon(n) {
            // Change the icon.
            if (n.parent().hasClass('active')) {
                // The user wants to collapse the child list.
                n.find('i').removeClass('icon-plus-sign').addClass('icon-minus-sign');
            } else {
                // The user wants to expand the child list.
                n.find('i').removeClass('icon-minus-sign').addClass('icon-plus-sign');
            }
        }

        function checkSiblings(el, checked) {
            if (!el.length){
                return;
            }
            var parent = el.parent().parent();
            var all = true;
            var thisNode = parent.children(options.node).find(':checkbox');
            el.siblings().not('.empty').each(function() {
                return all = ($(this).find(':checkbox').prop("checked") === checked);
            });
            if (all && checked) {
                $(':checkbox', parent).prop({
                    indeterminate: false,
                    checked: checked
                });
                colorCoded(thisNode);
                checkSiblings(parent, checked);
            } else if (all && !checked) {
                thisNode.prop("checked", checked);
                thisNode.prop("indeterminate", (parent.find(':checked').length));
                colorCoded(thisNode);
                checkSiblings(parent, checked);
            } else {
                el.parents("li").children(options.node).find(':checkbox').prop({
                    indeterminate: true,
                    checked: false
                });
                colorCoded(el.parents("li").children(options.node).find(':checkbox'));
            }
        }
        checkSiblings($(options.nodeDepth + ' :checked').closest('li'), true);
    };

})(jQuery);
