(function($) {
    $.fn.tabs = function(opt) {
        this.each(function () {
            var $core = $(this),
                tabsName = $core.data('tabs-name'),
                generateSelector = function (sel) { return (tabsName ? '[data-tabs-for=' + tabsName + ']' : '') + sel; },
                animationDuration = 300,
                $bar = $core.find(generateSelector('[data-tabs=bar]')),
                $activeTab = { link: $core.find(generateSelector('[data-tabs=link].is-active')), pane: $core.find(generateSelector('[data-tabs=pane].is-active')) },
                barChangeProps = $bar.data('tabs-bar-props');

            var positionBar = function () {
                if (!$bar.length) return;
                $bar.css({ left: $activeTab.link.position().left, width: $activeTab.link.outerWidth() });
                if (barChangeProps) {
                    var barChangePropsArray = barChangeProps.split(',');
                    for (var i in barChangePropsArray)
                        $bar.css(barChangePropsArray[i], $activeTab.link.data('tabs-bar-color'));
                }
            }

            if (typeof opt == 'string') {
                switch (opt) {
                    case 'update':
                        positionBar();
                        if ($core[0]._is) $core[0]._is.refresh();
                        break;
                }
                return;
            }

            if (($ul = $core.find(generateSelector('[data-tabs=link]')).closest('ul')).length) {
                var scroll = new IScroll($ul.wrap('<div>').parent()[0], { scrollX: true, scrollY: false, mouseWheel: true });
                $core[0]._is = scroll;
            }

            $core.find(generateSelector('[data-tabs=link]')).click(function (e) {
                e.preventDefault();

                var $this = $(this),
                    $newTab = $core.find($this.attr('href')),
                    direction = !$newTab.nextAll(generateSelector('[data-tabs=pane].is-active')).length ? 1 : -1,
                    translateOffset = 30;

                if ($this.hasClass('is-active') || $this.hasClass('is-disabled'))
                    return;

                $activeTab.pane.css({ 'transition-duration': animationDuration + 'ms', 'transform': 'translate3d(' + (translateOffset * -direction) + 'px, 0, 0)', opacity: 0 });
                $newTab.css({ 'transition-duration': animationDuration + 'ms', 'transform': 'translate3d(' + (translateOffset * direction) + 'px, 0, 0)', opacity: 0 });
                $this.trigger('tabs:beforeShow', [$newTab]);
                setTimeout(function () {
                    $activeTab.pane.removeClass('is-active');
                    $newTab.addClass('is-active');
                    setTimeout(function () {
                        $newTab.css({ opacity: 1, transform: 'translate3d(0)' });
                    }, 50);
                    setTimeout(function () { $newTab.css('transform', ''); }, animationDuration);
                    $activeTab.pane = $newTab;
                    $this.trigger('tabs:afterShow', [$newTab]);
                    $core.find('.' + $core[0].className.split(' ').join(', .')).tabs('update');
                }, animationDuration);

                $activeTab.link.removeClass('is-active');
                $activeTab.link = $this.addClass('is-active');
                positionBar();
            });

            $core.find('a[href^="#"]:not([data-tabs=link])').click(function () {
                if ($(this).attr('href') == '#')
                    return true;
                var $block = $($(this).attr('href'));
                if ($block.length) {
                    $core.find('[data-tabs=link][href="' + $(this).attr('href') + '"]').click();
                    return false;
                }
            });

            positionBar();
        })
    }
})(jQuery);