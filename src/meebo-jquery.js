// These are some reusable components I put together as part of the
// team building meebo's "interest graph" product. In the third and
// final version of the product, we switched from YUI 3 to jQuery,
// and moved as much logic to the server as possible.
//
// Although the team focused on writing throwaway code, I was able
// to find a few long-lived UI components that occurred throughout
// the product in slightly-different forms, abstract just enough to
// reduce duplication, and add some documentation to codify assumptions.
//
// Here are a few of those components. I haven't modified them
// from the production versions, except to replace inline comments
// with the multiline style (for docco clarity), and of course other
// developers have made (mostly minor) changes: this isn't solely mine.
//
// Note also that the terse one-liners and very, very minimal in-code
// comments are the meebo house style, not my personal style. I've
// included tooltip code at the bottom of this article as an example of
// code written by meebo's longest-tenured JS developer; his personal
// style was enforced as the team style.
//
// I downloaded this code from [meebo's cdn](s4.meebocdn.net/bigben-static/0.38.0/js/base.js),
// where it will be available until 7/11/12, when meebo.com is shut down.

/*
 * dropdowns are swell
 *
 * optionally will dynamically fetch contents for you (via data-dropdown-endpoint attr)
 *
 * expects markup of the form
 *    <div class="header-menu">
 *        <div class="menu" data-dropdown-endpoint="/api/foo"> Your loading msg here </div>
 *    </div>
 *
 * the menu is hidden by default and shown by toggling an 'open' class on the header-menu
 *
 * todo factor out special-case stuff around notification dropdown
 */
$('.header-menu').on('click', function(e) {
    var menuTop = $(this), menu = $(this).find('.menu');
    menuTop.toggleClass('open');
    $('.header-menu').each(function(i, el) { if (menuTop[0] != el) { $(el).removeClass('open') } });
    /* notification dropdown */
    if (menuTop.hasClass('.unread-count')) { menuTop.find('.button').toggleClass('down') }
    if (menuTop.hasClass('open')) {
        setTimeout(function() {
            $(document).one('click', function(e) {
                menuTop.removeClass('open');
                menuTop.find('.button').removeClass('down');
                /* notification dropdown */
                if (menuTop.hasClass('unread-count')) {
                    menuTop.addClass('empty');
                    menuTop.find('.count').text(0);
                    menuTop.find('.button').removeClass('yellow-button');
                }
            })
        }, 0);
    }
    if (menu.data('dropdown-endpoint')) {
        $.ajax({
            url: menu.data('dropdown-endpoint'),
            type: 'POST',
            success: function(e) { menu.html(e.html) }
        });
    }
});
        

/*
 * info-tooltip is a small black tooltip that holds one *short* line of white info text.
 *
 * intent:
 *    clarify the meaning of iconography by providing a short textual hint.
 *
 * WARNING: long text is ellipsized.
 *
 * usage:
 *    data-info-tooltip: text to be inserted.
 *    (optional) data-info-tooltip-position: 'above' or 'below' (default), specifies tooltip orientation.
 *
 * example: 
 *    <div data-info-tooltip="tooltip contents" data-info-tooltip-position="above">
 *        <span class="some incomprehensible icon"></span>
 *    </div>
 *
 * todo: remove hide logic duplication. add short mouseout timer. transition in/out smoothly.
 */
$(document).on('mouseenter', '*[data-info-tooltip]', function (e) {
    if (!$('.info-tooltip').length) { 
        $('<div class="tooltip info-tooltip"><div class="contents"></div><div class="arrow"><div>')
            .css('visibility', 'hidden')
            .appendTo(document.body); 
    }

    var target = $(this).closest('[data-info-tooltip]'),
        tooltip = $('.info-tooltip'),
        arrow = tooltip.find('.arrow'),
        position = target.data('info-tooltip-position') || 'below',
        text = target.data('info-tooltip'),
        topOffset;

    if (tooltip.is(':visible')) { 
        tooltip
            .removeClass('above below')
            .css('visibility', 'hidden')
            .find('contents').text('');
    }
    tooltip
        .addClass(position)
        .find('.contents').text(text);

    /* setTimeout so we can accurately measure tooltip's width */
    setTimeout(function() {
        topOffset = position == 'above' ? target.offset().top - tooltip.outerHeight() : target.offset().top + target.outerHeight();
        arrow.css('left', tooltip.outerWidth()/2 - arrow.outerWidth()/2);
        tooltip
            .css('top', topOffset)
            .css('left', target.offset().left + (target.outerWidth() - tooltip.outerWidth())/2)
            .css('visibility', 'visible');
    }, 0);
}).on('mouseleave', '[data-info-tooltip]', function (e) {
    $('.info-tooltip')
        .removeClass('above below')
        .css('visibility', 'hidden')
        .find('.contents').text('');
});

/*
 * tabs are swell
 *
 * .tab properties:
 *   - href attribute - selector for tab container. just use an id.
 *   - data-endpoint attribute (optional) - relative URL to fetch tab pane contents
 *    - data-cache attribute (optional) - don't refetch from endpoint if tab pane isn't empty.
 *      - intent: improve UI responsiveness on mobile
 *
 * markup structure: 
 * - .tab-list should contain only .tab children
 * - each .tab's corresponding .tab-pane is identified by an href attribute on the .tab
 * - the currently-active .tab and .tab-pane have the 'active' class
 *
 * <div class="tab-list">
 *   <div class="tab active" href="#foo" data-endpoint="/api/bar">foo</div>
 *   <div class="tab" href="#bar" data-endpoint="/api/baz" data-cache="true">bar</div>
 * </div>
 * <div id="foo" class="tab-pane active"></div>
 * <div id="bar" class="tab-pane"></div>
 *
 * todo: add css for vertical tabs or horiz/vert pill styles
 */
(function() {
    function switchTab(tab) {
        tab.siblings('.tab')
            .each(function(i,el) {
                $(el).removeClass('active');
                $($(el).attr('href')).removeClass('active');
            });
        tab.addClass('active');
        $(tab.attr('href')).addClass('active');
    }
    $(document).on('click', '.tab-list .tab', function (e) {
        var tab = $(this),
            pane = $(tab.attr('href')),
            loader = tab.siblings('.tab-loader'),
            endpoint = tab.data('endpoint');
        if (!pane.length || tab.hasClass('active')) { return; }
        if (endpoint && !(pane.html() && tab.data('cache'))) {
            if (loader) { loader.fadeIn('fast'); }
            $.ajax({
                type: 'GET',
                url: endpoint,
                headers: {'Authorization': 'Token token=' + $.cookie('apitoken')},
                success: function (data) {
                    var html = data.html.trim() ? $(data.html) : '';
                    if (loader) { loader.fadeOut('fast'); }
                    pane.html(html);
                }
            });
        }
        switchTab(tab);
    });
})();

// For context, here's a tooltip written by the developer who defined
// meebo's team style. Compared to the bulk of the meebo codebase, this
// is an extremely generously documented example.
//
// I have modified the code to replace one-line with multi-line comments,
// so that docco doesn't split out the original code comments from the code.
//
// This code was downloaded from [meebo's cdn](s4.meebocdn.net/bigben-static/0.38.0/js/tooltip.js),
// where it'll be available until meebo shuts down on 7/11/12.
(function ($) {

    Tooltip = {

        stuck: false,
        tooltip: null,
        hoveredElement: null,
        loadingEndpoints: {},
        loadedEndpoints: {},
        /* keep the loaded endpoints in the dom so that their state can
           be updated */
        loadedEndpointsContainer: $('<div>').appendTo(document.body).hide(),

        delay: 600,
        /* after showing the tooltip if the user hovers to another element
           with a tooltip in a short period then skip the delay */
        skipDelay: false,
        skipDelayTimeout: null,

        hideTimeout: null,

        dimensions: {
            padding: 8,
            arrowBounds: 8,
            target: {},
            tooltip: {},
            viewport: {}
        },

        showWithDelay: function (el, contents, position) {
            if (this.stuck) { return; }
            this._hide();
            clearTimeout(this.skipDelayTimeout);
            this.hoveredElement = el;
            if (this.skipDelay) { this.show(el, contents, position); }
            else {
                var self = this;
                setTimeout(function () {
                    if (self.hoveredElement != el) { return; }
                    self.show(el, contents, position);
                }, this.delay);
            }
        },

        show: function (el, contents, position) {
            if (this.stuck) { return; }
            if (!contents && $(el).data('tooltip-endpoint')) {
                return this._loadEndpoint(el, position);
            }

            this._hide();
            clearTimeout(this.skipDelayTimeout);
            this.skipDelay = true;

            /* create the tooltip */
            this.hoveredElement = el;
            this.tooltip = $('<div class="tooltip">' +
                '<div class="arrow"><div></div></div>' + 
                '<div class="content"></div>' +
            '</div>').css({visibility: 'hidden'});
            $('.content', this.tooltip).append(contents);
            this.tooltip.appendTo(document.body);
            var self = this;
            this.tooltip.mouseenter(function (e) {
                clearTimeout(self.hideTimeout);
            }).mouseleave(function (e) {
                if (!self.stuck) { self.hide(); }
            });

            /* set up the dimensions */
            var target = $(el);
            this.dimensions.target = target.offset();
            this.dimensions.target.width = target.outerWidth();
            this.dimensions.target.height = target.outerHeight();
            this.dimensions.tooltip = {
                width: this.tooltip.outerWidth(),
                height: this.tooltip.outerHeight()
            };
            this.dimensions.viewport = {
                top: $(window).scrollTop(),
                left: $(window).scrollLeft(),
                width: $(window).width(),
                height: $(window).height()
            };

            /* work out where to place the tooltip */
            if (!position) {
                position = ['below', 'below-left', 'above', 'above-left'];
            }
            var positions = (position instanceof Array ? position : null);
            if (positions) {
                for (var i = 0; (position = positions[i]); i++) {
                    var offset = this._getOffsetForPosition(position);
                    if (this._isInBounds(offset)) { break; }
                }
                /* if none are in bounds, check to see if the tooltip target
                   itself is out of bounds and allow the tooltip to go out of
                   bounds in the same direction */
                for (var i = 0; (position = positions[i]); i++) {
                    var offset = this._getOffsetForPosition(position);
                    if (this._isDirectionallyInBounds(position, offset)) { break; }
                }
                if (!position) {
                    position = positions[0];
                    offset = this._getOffsetForPosition(position);
                }
            } else {
                var offset = this._getOffsetForPosition(position);
            }

            this.tooltip
                .css(offset)
                .addClass(position)
                .css({visibility: 'visible'});

            return this;
        },

        hide: function (el) {
            var self = this;
            clearTimeout(this.hideTimeout);
            this.hideTimeout = setTimeout(function () { self._hide(el); }, 0);
            return this;
        },

        _hide: function (el) {
            clearTimeout(this.hideTimeout);
            if (el && el != this.hoveredElement) { return; }
            if (this.tooltip) { this.tooltip.remove(); }
            var endpoint = $(this.hoveredElement).data('tooltip-endpoint');
            if (endpoint) {
                this.loadedEndpointsContainer.append(this.loadedEndpoints[endpoint]);
            }
            this.tooltip = null;
            this.hoveredElement = null;
            this.stuck = false;
            clearTimeout(this.skipDelayTimeout);
            if (this._onHide) { this._onHide(); this._onHide = null; }
            var self = this;
            this.skipDelayTimeout = setTimeout(function () {
                self.skipDelay = false;
            }, 600);
        },

        stick: function () { this.stuck = true; return this; },

        onHide: function (callback) { this._onHide = callback; return this; },

        _loadEndpoint: function (el, position) {
            var endpoint = $(el).data('tooltip-endpoint');
            if (endpoint in this.loadedEndpoints) {
                this.show(el, this.loadedEndpoints[endpoint], position);
            } else if (!(endpoint in this.loadingEndpoints)) {
                var self = this;
                $.get(endpoint, function (data) {
                    var html = $(data.tooltip_html), el = self.hoveredElement;
                    self.loadedEndpoints[endpoint] = html;
                    self.loadedEndpointsContainer.append(html);
                    delete self.loadingEndpoints[endpoint];
                    if (el && $(el).data('tooltip-endpoint') == endpoint) {
                        self.show(el, html, position);
                    }
                });
                self.loadingEndpoints[endpoint] = true;
            }
        },

        _getOffsetForPosition: function (position) {
            var ds = this.dimensions,
                y = ds.target.top, x = ds.target.left,
                h = ds.tooltip.height, w = ds.tooltip.width;

            var top, left;
            switch (position) {
                case 'above': case 'above-left':
                    top = y - h - ds.arrowBounds; break;
                case 'below': case 'below-left':
                    top = y + ds.target.height; break;
                case 'left': case 'right': top = y - 5; break;
                case 'left-above': case 'right-above':
                    top = y - h + 20; break;
            }
            switch (position) {
                case 'above': case 'below': left = x; break;
                case 'above-left': case 'below-left':
                    left = x + ds.target.width - w; break;
                case 'left': case 'left-above':
                    left = x - w - ds.arrowBounds; break
                case 'right': case 'right-above':
                    left = x + ds.target.width; break
            }
            return {top: top, left: left};
        },

        /* Note: these methods expect "this" to be the Tooltip */
        _isInBoundsDirection: {
            top: function (offset) {
                var ds = this.dimensions;
                return offset.top - ds.padding > ds.viewport.top;
            },
            bottom: function (offset) {
                var ds = this.dimensions;
                /* because we're only measuring above/below add arrowBounds
                   to the height always */
                return (offset.top + ds.tooltip.height + ds.arrowBounds
                    + ds.padding < ds.viewport.top + ds.viewport.height);
            },
            left: function (offset) {
                var ds = this.dimensions;
                return offset.left - ds.padding > ds.viewport.left;
            },
            right: function (offset) {
                var ds = this.dimensions;
                return (offset.left + ds.tooltip.width + ds.padding
                    < ds.viewport.left + ds.viewport.width);
            }
        },

        _isInBounds: function (offset) {
            return (
                this._isInBoundsDirection.left.call(this, offset) &&
                this._isInBoundsDirection.right.call(this, offset) &&
                this._isInBoundsDirection.top.call(this, offset) &&
                this._isInBoundsDirection.bottom.call(this, offset));
        },

        /* Check to see if the tooltip is in bounds only bounded by the sides
           with which the tooltip is aligned and only enforcing that bound if
           the target is in bounds. This allows positioning the tooltip where
           it would go if the target was fully in bounds but is prevented from
           doing so because the target is out of bounds. */
        _isDirectionallyInBounds: function (position, offset) {
            var ds = this.dimensions, t = ds.target, v = ds.viewport;
            var vertical, horizontal;
            switch (position) {
                case 'above': case 'above-left':
                case 'left-above': case 'right-above':
                    vertical = (t.top > v.top)
                        && this._isInBoundsDirection.top.call(this, offset);
                    break;
                case 'below': case 'below-left':
                case 'left': case 'right':
                    vertical = (t.top + t.height < v.top + v.height)
                        && this._isInBoundsDirection.bottom.call(this, offset);
                    break;
            }
            switch (position) {
                case 'right': case 'right-above':
                case 'below': case 'above':
                    horizontal = (t.left + t.width < v.left + v.width)
                        && this._isInBoundsDirection.right.call(this, offset);
                    break;
                case 'above-left': case 'below-left':
                case 'left': case 'left-above':
                    horizontal = (t.left > v.left)
                        && this._isInBoundsDirection.left.call(this, offset);
                    break;
            }
            return vertical && horizontal;
        }

    };

    $(document).on('mouseenter', '*[data-tooltip-endpoint]', function (e) {
        Tooltip.showWithDelay(this);
    }).on('mouseleave', '*[data-tooltip-endpoint]', function (e) {
        Tooltip.hide(this);
    });

})(jQuery);
