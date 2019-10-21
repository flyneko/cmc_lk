


(function ($) {

    /**
     * Tests if a node is positioned within the current viewport.
     * It does not test any other type of "visibility", like css display,
     * opacity, presence in the dom, etc - it only considers position.
     *
     * By default, it tests if at least 1 pixel is showing, regardless of
     * orientation - however an optional argument is accepted, a callback
     * that is passed the number of pixels visible on each edge - the return
     * (true of false) of that callback is used instead.
     */
    $.fn.isOnScreen = function(){

        var $elem = this;
        var $window = $(window);

        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();

        var elemTop = $elem.offset().top;
        var elemBottom = elemTop + $elem.height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    };

})(jQuery);

function scrollToVCenter(selector, dur) {
    if (typeof selector === 'string' || selector instanceof String || selector instanceof jQuery) {
        var el = typeof selector === 'string' || selector instanceof String ? $( selector ) : selector;
        var elOffset = el.offset().top;
        var elHeight = el.outerHeight();
    } else {
        var elOffset = selector.top;
        var elHeight = selector.height;
    }


    var windowHeight = $(window).outerHeight();
    var offset;

    if (elHeight < windowHeight) {
        offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
    }
    else {
        offset = elOffset;
        offset -= ($('.header').css('position') == 'fixed' ? $('.header').outerHeight() : 0) + 10;
    }
    var speed = dur ? dur : 700;
    $('html, body').animate({scrollTop:offset}, speed);
    return false;
}

function isTouchDevice() {
    return 'ontouchstart' in window        // works on most browsers
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

function number_format(number, decimals, decPoint, thousandsSep){
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''
    var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k)
                .toFixed(prec)
    }
    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
}

function SwiperProxy($els, op) {
    $els.each(function () {
        var $el = $(this);
        var opt = $.extend({
            watchOverflow: true,
            pagination: {
                clickable: true
            }
        }, op);

        if ($el.data('swiper-inited'))
            return;

        $el.data('swiper-inited', true);

        if (opt.dots) {
            opt.pagination = $.extend(opt.pagination || {}, {
                bulletClass: 'swiper-dot',
                bulletActiveClass: 'active',
                el: $('<div>', { class: 'swiper-dots' }).insertAfter($el).get(0)
            });
            delete opt.dots;
        }

        if (opt.nav) {
            var $nav = $('<div>', { class: 'swiper-nav' }).insertAfter($el);
            opt.navigation = {
                nextEl: $('<div>', { class: 'swiper-next' }).appendTo($nav).get(0),
                prevEl: $('<div>', { class: 'swiper-prev' }).appendTo($nav).get(0),
            }
            delete opt.nav;
        }

        $el.data('swiper', new Swiper(this, opt));
    });

    return $els.length == 1 ? $els.get(0).swiper : true;
}



(function($) {
    $.fn.widthReplace = function(selector) {
        var $this = $(this);
        var init = function () {
            $this.each(function () {
                var $target = $(this);
                var placeSelector = $target.data('place');
                var parent = $target.data('parent');
                var placeWidth = parseInt($target.data('width'));
                var $place = parent ? $target.parents(parent).find(placeSelector) : $(placeSelector);

                if (window.innerWidth <= placeWidth) {
                    $place.show()
                    if (!$place.data('old-place'))
                        $place.data('old-place', $target.wrap('<div>').parent());
                    $target.appendTo($place);
                } else {
                    $place.hide();
                    if ($place.data('old-place'))
                        $target.appendTo($place.data('old-place'));

                }
            });
        }

        init();
        $(window).resize(init);
        return this;
    }
})(jQuery);
