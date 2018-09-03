/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    'use strict';

    if ($('#accountContent').size() > 0) {
        $('#displayForm').prepend('<input type="hidden" name="userId" value="' + $('#admui-signOut')
            .attr("data-user") + '">');
    }

    if (!window.localStorage) {
        return;
    }

    var Skintools = {
        storageKey: 'admui.base.skinTools',
        path: $.ctx + 'public/themes/classic/base',
        $siteSidebar: $.parentFrame.find('.site-menubar'),
        $siteNavbar: $.parentFrame.find('.site-navbar'),
        navbarSkins: 'bg-primary-600 bg-brown-600 bg-cyan-600 bg-green-600 bg-grey-600 bg-indigo-600 bg-orange-600 bg-pink-600 bg-purple-600 bg-red-600 bg-teal-600 bg-yellow-700',
        defaultSettings: {
            sidebar: 'site-menubar-dark',
            navbar: 'bg-primary-600',
            navbarInverse: 'navbar-inverse',
            themeColor: 'primary',
            menuDisplay: 'site-menubar-unfold',
            menuTxtIcon: 'site-menubar-keep',
            tabFlag: 'site-contabs-open'
        },
        init: function () {
            var self = this;

            $(document).on('change', '#skintoolsSidebar', function () { // 菜单主题
                self.sidebarEvents($(this));
            });
            $(document).on('click', '#skintoolsNavbar input', function () { // 导航条颜色
                self.navbarEvents($(this));
            });
            $(document).on('click', '#skintoolsPrimary input', function () { // 主题颜色
                self.primaryEvents($(this));
            });

            $(document).on("change", 'input[name="menuDisplay"]', function () { // 菜单显示
                var $menuFold = $("#menuFoldSetting"),
                    value = $(this).val();
                if (value === 'site-menubar-unfold') {
                    $menuFold.addClass("hidden");
                    $.site.menubar.unfold();
                } else {
                    $menuFold.removeClass("hidden");
                    $.site.menubar.fold();
                }
                self.updateSetting('menuDisplay', value);

                self.initLocalStorage();
            });

            // 鼠标经过左侧菜单时显示文字 | 图标
            $(document).on("change", 'input[name="menuTxtIcon"]', function () {
                var value = $(this).val();
                if (value === 'site-menubar-keep') { // 显示文字
                    $.parentFrame.find("body").removeClass("site-menubar-fold-alt").addClass("site-menubar-keep");
                } else {
                    $.parentFrame.find("body").removeClass("site-menubar-keep").addClass("site-menubar-fold-alt");
                }
                self.updateSetting('menuTxtIcon', value);
            });

            $(document).on('change', 'input[name="tabFlag"]', function () { // Tab页签
                var value = $(this).val();
                if (value === 'site-contabs-open') {
                    $('#admui-siteConTabs ul.con-tabs', $.parentFrame).removeAttr('style');
                    $.parentFrame.find("body").addClass("site-contabs-open");

                    //$.site.contentTabs.containerSize();
                } else {
                    $.parentFrame.find("body").removeClass("site-contabs-open");
                }
                self.updateSetting('tabFlag', value);
            });

            $(document).on("click", "button[name='save']", function (e) {
                var settings = $.storage.get(self.storageKey);

                if (settings === null) {
                    settings = self.defaultSettings;
                }

                //可以保存数据到后台
                //console.info(settings);
                e.preventDefault();
            });

            $(document).on('click', '#skintoolsReset', function () { // 恢复默认
                self.reset();
            });

            $('#skintoolsSidebar').selectpicker($.po('selectpicker'));

            this.initLocalStorage();
        },
        initLocalStorage: function () {
            this.settings = $.storage.get(this.storageKey);

            if (this.settings === null) {
                this.settings = $.extend(true, {}, this.defaultSettings);

                $.storage.set(this.storageKey, this.settings);
            }

            if (this.settings && $.isPlainObject(this.settings)) {
                $.each(this.settings, function (n, v) {
                    switch (n) {
                        case 'boxLayout':
                            $('#boxLayout').prop('checked', v !== "");
                            break;
                        case 'sidebar':
                            $('#skintoolsSidebar').selectpicker('val', [v]);
                            break;
                        case 'navbar':
                            $('input[value="' + v + '"]', $("#skintoolsNavbar>ul")).prop('checked', true);
                            break;
                        case 'navbarInverse':
                            $('#navbarDisplay').prop('checked', v !== '');
                            break;
                        case 'menuDisplay':
                            $('input[value="' + v + '"]', '#displayForm').prop('checked', true);
                            break;
                        case 'menuTxtIcon':
                            if ($('#menuFold').is(':checked')) {
                                $('#menuFoldSetting').removeClass('hidden ');
                                $('input[name="menuTxtIcon"]', '#displayForm').parent('label')
                                    .removeClass('active');
                                $('input[value="' + v + '"]', '#displayForm').prop('checked', true)
                                    .parent('label').addClass('active');
                            }
                            break;
                        case 'themeColor':
                            $('input[value="' + v + '"]', "#skintoolsPrimary").prop('checked', true);
                            break;
                        case 'tabFlag':
                            $('input[value="' + v + '"]', '#displayForm').prop('checked', true);
                    }
                });
            }
        },

        updateSetting: function (item, value) {
            this.settings[item] = value;

            $.storage.set(this.storageKey, this.settings);
        },
        sidebarEvents: function ($item) {
            var val = $item.val();

            this.sidebarImprove(val);
            this.updateSetting('sidebar', val);
        },
        navbarEvents: function ($item) {
            var val = $item.val(),
                checked = $item.prop('checked');

            this.navbarImprove(val, checked);

            if (val === 'navbar-inverse') {
                this.updateSetting('navbarInverse', checked ? val : '');
            } else {
                this.updateSetting('navbar', val);
            }
        },
        primaryEvents: function ($item) {
            var val = $item.val();

            this.primaryImprove(val);

            this.updateSetting('themeColor', val);
        },
        sidebarImprove: function (val) {
            if (val === 'site-menubar-light') {
                this.$siteSidebar.removeClass('site-menubar-dark').addClass(val);
            }
            else {
                this.$siteSidebar.removeClass('site-menubar-light').addClass(val);
            }
        },
        navbarImprove: function (val, checked) {
            if (val === 'navbar-inverse') {
                checked ? this.$siteNavbar.addClass(val) : this.$siteNavbar.removeClass(val);
            }
            else {
                this.$siteNavbar.removeClass(this.navbarSkins).addClass(val);
            }
        },
        primaryImprove: function (val) {
            var self = this,
                $parentLink = $('#admui-siteStyle', $.parentFrame),
                $iframes = $.parentFrame.find('#admui-pageContent>iframe'), parentHref,
                parentEtx = $parentLink.prop('href').indexOf('?v=') === -1 ? '' : '.min';

            if (val === 'primary') {
                parentHref = this.path + '/css/index' + parentEtx + '.css';
            }
            else {
                parentHref = this.path + '/skins/' + val + '/index' + parentEtx + '.css';
            }

            $parentLink.attr('href', parentHref);

            $iframes.each(function () {
                var thisName = $(this).attr('name'),
                    $that = $('#admui-siteStyle',parent.frames[thisName].document),
                    iframeEtx, iframeHref;

                if ($that.length) {
                    iframeEtx = $that.prop('href').indexOf('?v=') === -1 ? '' : '.min';
                    if (val === 'primary') {
                        iframeHref = self.path + '/css/site' + iframeEtx + '.css';
                    }
                    else {
                        iframeHref = self.path + '/skins/' + val + '/site' + iframeEtx + '.css';
                    }

                    $that.attr('href', "../../../"+iframeHref);
                }
            });
        },
        reset: function () {
            localStorage.clear();
            location.reload(true);
        }
    };

    Skintools.init();

})(window, document, jQuery);