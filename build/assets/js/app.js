var PluginsInit = {
    CustomScroll: function (el) {
        var Scrollbar = window.Scrollbar;

        var scrollbar = Scrollbar.init(el, {
            damping: 0.3,
            continuousScrolling: true
        });
        el.classList.add('scrollbar');

        var q = scrollbar.update;
        var checkState = function () {
            el.classList[!scrollbar.limit.y ? 'add' : 'remove']('is-empty');
        };

        scrollbar.update = function () {
            q.call(this);
            checkState()
        }

        if (el.hasAttribute('data-scroll-nice')) {
            el.classList.add('is-top');
            el.classList.add('scrollbar--nice');
            setTimeout(checkState, 1);

            scrollbar.addListener(function (status) {
                el.classList[scrollbar.scrollTop <= 100 ? 'add' : 'remove']('is-top');
                el.classList[scrollbar.scrollTop >= status.limit.y - 100 ? 'add' : 'remove']('is-bottom');
            })
        }

        el._ss = scrollbar;
    },

    tippy: function (el) {
        var $this = $(el);
        tippy(el, {
            arrow: true,
            interactive: $this.data('interactive') || false,
            content: function(ref) {
                var title = ref.getAttribute('title')
                ref.removeAttribute('title')
                return ref.hasAttribute('content') ? ref.getAttribute('content') : title
            },
            animation: 'perspective',
        });
    }
}

$(function () {
    // Sample carousel
    (function () {
        $('.js-sample-carousel').each(function () {
            var $carousel = $(this);
            var slidesOptions = $carousel.data('slides');
            var slidesCount = slidesOptions[0].toString().split('x');

            var breakpointsOptions = {};
            for (var i in slidesOptions[1]) {
                var breakpointSlidesCount = slidesOptions[1][i].toString().split('x');
                breakpointsOptions[i] = { slidesPerView: breakpointSlidesCount[0], slidesPerColumn: breakpointSlidesCount[1] || 1 }
            }

            var swiperOptions = {
                dots: true,
                nav: false,
                slidesPerView: slidesCount[0],
                slidesPerColumn: slidesCount[1] || 1,
                spaceBetween: 16,
                watchOverflow: true,
                pagination: {
                    clickable: true
                },
                breakpoints: breakpointsOptions
            };

            if ($carousel.data('scroll')) {
                swiperOptions = Object.assign(swiperOptions, {
                    scrollbar: {
                        el: $('<div>', { class: 'swiper-scrollbar' }).appendTo($carousel).get(0),
                        draggable: true,
                    },
                    dots: false,
                    nav: false
                });
            }

            SwiperProxy($carousel, swiperOptions);
        })
    })();

    $('.js-scroll').each(function () {
        PluginsInit.CustomScroll( this );
    });


    $('.js-replace').widthReplace();

    // Tabs
    $('.js-tabs').each(function () {
        var $this = $(this);
        $this.tabs();
        $this.on('tabs:afterShow', function (e, $pane) {
            if ($pane.hasClass('js-scroll'))
                $pane[0]._ss.update();
            $pane.find('.js-scroll').each(function () {
                this._ss.update()
            });
        })
    });

    // Fancybox
    (function () {
        $.fancybox.defaults = Object.assign($.fancybox.defaults, {
            touch: false,
            closeExisting: true,
            toolbar: false,
            beforeShow: function () {
                var self = this;
                setTimeout(function () {
                    self.$content.find('.js-table').each(function () {
                        this._tabulator.redraw();
                    });
                });
            },
            afterShow: function () {
                this.$content.find('.js-tabs').tabs('update');

            },
            btnTpl   : {
                smallBtn : '<button data-fancybox-close class="modal-close" title="Закрыть"><svg class="icon icon-close"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./assets/img/sprite.svg#icon-close"></use></svg></button>'
            }
        });

        $('[data-fancybox]').fancybox();
    })();


    // Phone mask
    $('.js-phone-mask').each(function () {
        var $this = $(this);
        $this.mask("+7 (000) 000-00-00");
    });

    // Tooltip
    $('[title], [data-tippy]').each(function () {
        PluginsInit.tippy(this)
    });

    // Table
    (function () {
        Page.prototype._generatePageButton = function(page){
            var self = this,
                button = document.createElement("button");

            button.classList.add("tabulator-page");
            if(page == self.page){
                button.classList.add("active");
            }

            button.setAttribute("type", "button");
            button.setAttribute("role", "button");
            button.setAttribute("aria-label", "Страница " + page);
            button.setAttribute("title", "Страница " + page);
            button.setAttribute("data-page", page);
            button.textContent = page;

            button.addEventListener("click", function(e){
                self.setPage(page);
            });

            return button;
        };

        $('.js-table').each(function () {
            var $this = $(this);
            var table = new Tabulator(this, {
                locale: 'ru',
                langs:{
                    "ru":{
                        "ajax":{
                            "loading": "Загрузка",
                            "error":"Ошибка",
                        },
                        "pagination":{
                            "prev_title":"Предыдущая страница",
                            "next_title":"Следующая страница",
                        }
                    }
                },
                placeholder: "Нет данных для отображения",
                layout:"fitColumns",
                pagination: "local",
                paginationSize: $this.data('items') || 11,
                paginationSizeSelector: false,
                headerSort: false,
                responsiveLayout:"collapse",
                columns: $this.data('without-select') ? [] : [
                    {formatter: function () {
                        return '<div class="checkbox"> <input type="checkbox"> <div class="checkbox__i"></div></div>';
                    }, align:"center", width: 50, headerSort:false, cellClick:function(e, cell){
                        cell.getRow().toggleSelect();
                    }}
                ],
                dataFiltered: function(filters, rows){
                    var footerEl = this.footerManager.element;
                    footerEl.style.display = rows.length ? 'block' : 'none'
                },
                tableBuilt: function() {
                    var $searchForm = null;

                    if ($this.data('search')) {
                        $searchForm = $('<div class="row justify-content-end m-b-0">' +
                            '<div class="col-lg-4 col-md-5 col-sm-6 col-12">' +
                            '<div class="complex-input"><input class="input" type="text" placeholder="Поиск...">' +
                            '<button type="reset" class="complex-input__reset"></button>' +
                            '<span class="complex-input__icon"> <svg class="icon icon-loupe"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./assets/img/sprite.svg#icon-loupe"></use></svg> </span>' +
                            '</div>' +
                            '</div>' +
                            '</div>');

                        $searchForm.insertBefore(this.element);
                    } else if ($this.data('search-form')) {
                        $searchForm = $($this.data('search-form'));
                    }

                    var updateFilter = function () {
                        var query = this.value;

                        if (!query || query.trim().length == 0)
                            $reset.removeClass('is-active');
                        else
                            $reset.addClass('is-active');

                        function customFilter(data){
                            var regexp = new RegExp(query, 'gi');

                            for (var i in data) {
                                if (i == 'id') continue;

                                var val = data[i].toString().replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, '');
                                if (regexp.test(val))
                                    return true;
                            }

                            return false;
                        }

                        table.setFilter(customFilter);
                    }

                    if ($searchForm) {
                        var $input = $searchForm.find('input');
                        var $reset = $searchForm.find('button[type="reset"]').hide();

                        $input.on('input', updateFilter);

                        $reset.click(function (e) {
                            e.preventDefault();
                            $input.val('');
                            updateFilter();
                        })
                    }

                    this.element._tabulator = this;
                },
                renderComplete:function(){
                    $(this.element).find('a[title], a[data-tippy]').each(function () {
                        PluginsInit.tippy(this);

                        $(this).click(function (e) {
                            e.preventDefault();
                        })
                    });

                    $(this.element).find('[data-dropdown="drop"]').parent().dropdown()
                },
            });
        })
    })();

    // Select2
    $('.js-select').each(function () {
        var $select = $(this);

        function stateHandler(state) {
            var icon = $select.data('icon');

            return $select.data('label') ? $('<div><span>' + $select.data('label') + ':</span> <b>' + state.text + '</b>' + '</div>') : state.text;
        }

        $select.select2({
            placeholder: $select.data('placeholder') || '',
            minimumResultsForSearch: Infinity,
            width: '100%',
            templateSelection: stateHandler,
            containerCssClass: $select.data('class') || '',
            dropdownCssClass: $select.data('class') || '',
        });
    });

    // Toggle
    $('.js-toggle').click(function (e) {
        e.preventDefault();

        var $this = $(this);
        var target = $this.data('target');
        var targetClosest = $this.data('target-closest');

        if (target) {
            var $target= $(target);
            $target.toggle().removeClass('d-none');
        } else if (targetClosest)
            var $target= $this.closest(targetClosest);

        $target.toggleClass('is-toggle-open');
    });

    (function () {
        $('.btn-group').each(function () {
            var $group = $(this);
            var $btn = $group.find('> .btn');
            $btn.click(function (e) {
                e.preventDefault();
                $group.toggleClass('is-open');
            });

            $('html').click(function (e) {
                if (!$(e.target).closest('.btn-group').is($group))
                    $group.removeClass('is-open');
            })
        })
    })();

    (function () {
        var $els = $('.nav-sidebar');

        if (localStorage.getItem('nav-collapsed') == '1')
            $els.addClass('is-nav-collapsed');

        $('.js-nav-trigger').click(function (e) {
            e.preventDefault();
            $els.toggleClass('is-nav-collapsed');
            $els.toggleClass('is-nav-clicked');
            localStorage.setItem('nav-collapsed', +$els.hasClass('is-nav-collapsed'))
        });

        $('html').click(function (e) {
            var $target = $(e.target);
            if ($target.is($els))
                $els.removeClass('is-nav-clicked');
        })
    })();

    $('.js-dropdown:visible').dropdown();

    $('.js-datepicker').datepicker({
        autoClose: true
    });

    // Закрытие виджета
    $('.js-widget-close').click(function (e) {
        e.preventDefault();
        var $col = $(this).closest('[class^="col-"]');
        var $row = $col.closest('.row');

        $col.remove();

        if (!$row.children().length)
            $row.parent('[class^="col-"]').remove();
    });

    // Выбор файла
    $('.js-filepicker').each(function () {
        var $input = $(this);
        var $wrapper = $('<div class="filepicker">').insertBefore($input);
        var $button = $('<label class="btn btn--outline" style="border-width: 1px;min-height: 34px;font-size: 14px;text-transform: none;"><span>Обзор</span></label>').append($input).appendTo($wrapper);
        var $label = $('<span class="filepicker__label">Файл не выбран</span>').appendTo($wrapper);
        var $clear = $('<button class="filepicker__reset" type="button"><span>очистить</span></button>').hide().appendTo($wrapper);
        var reset = function () {
            $clear.hide();
            $label.html('Файл не выбран');
        }
        $input.change(function () {
            if (this.files && this.files.length) {
                var file = this.files[0];
                var fileSize = ((file.size / 1024) / 1024).toFixed(2); // MB

                $label.html(file.name + ', ' + fileSize + 'Мб');
                $clear.show();
            } else
                reset();
        });

        $clear.click(function (e) {
            e.preventDefault();
            $input.val('');
            reset();
        })
    });

    $('.js-spinner').each(function () {
        var $input = $(this),
            $wrap = $input.wrap('<div class="spinner">').parent(),
            $controls = $('<div class="spinner__controls">').appendTo($wrap),
            $plusBtn = $('<button type="button" class="spinner__btn spinner__btn--plus">').appendTo($controls),
            $minusBtn = $('<button type="button" class="spinner__btn spinner__btn--minus">').appendTo($controls),
            step = parseFloat($input.data('step') || 1),
            minimal = parseFloat($input.data('min') || 0);

        function checkState() {
            if (parseFloat($input.val()) <= minimal)
                $minusBtn.attr('disabled', true).prop('disabled', true);
            else
                $minusBtn.attr('disabled', false).prop('disabled', false);
            $input.focus();
        }

        $plusBtn.on('click', function () {
            $input.val(parseFloat($input.val() == '' ? 0 : $input.val()) + step);
            checkState();
        });

        $minusBtn.on('click', function () {
            $input.val(parseFloat($input.val() == '' ? 0 : $input.val()) - step);
            checkState();
        });
    });
});