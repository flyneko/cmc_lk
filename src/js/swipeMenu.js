(function($) {
    var events = {};
    $.swipeMenu = function (evt, callback) {
        // Инициализация возможных методов плагина
        events[evt] = callback;
        return this;
    };

    $.fn.swipeMenu = function() {
        var $all = $(this);
        var $html = $('html');
        var $main = $('[data-swipe-main]');
        this.each(function () {
            var $this = $(this);
            var $target = $($this.data('swipe-target'));
            var side = $this.data('swipe-side');
            var slideout = new Slideout({
                panel: $main[0],
                menu: $target[0],
                padding: $target.width(),
                tolerance: 70,
                duration: 600,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                touch: false,
                side: side || 'left'
            });
            var open = function() {
                $target.show();
                $this.addClass('is-active');
                if (events.open)
                    events.open.call(slideout);
            }
            slideout.on('translatestart', open);
            slideout.on('beforeopen', open);
            slideout.on('close', function() {
                $html.removeClass('slideout-closing');
                $target.hide();
                if (events.close)
                    events.close.call(slideout);
            });
            slideout.on('beforeclose', function () { $html.addClass('slideout-closing'); $this.removeClass('is-active'); });
            $this.data('slideout', slideout);
            $this.click(function () {
                if (!slideout.isOpen())
                    slideout.open();
                else
                    slideout.close();
                return false;
            });

            $main.click(function () {
                if (slideout.isOpen()) {
                    slideout.close();
                    return false;
                }
            });

            $target.find('[data-swipe-close]').click(function () {
                slideout.close();
            });

            $(window).resize(function () {
                if (!$this.is(':visible'))
                    slideout.close();
            });
        });

        return this;
    }
})(jQuery);