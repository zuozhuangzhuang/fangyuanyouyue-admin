/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function () {
    'use strict';

    var $nestable = $('[data-plugin="nestable"]'),
        $topMenu = $('.top-menu');

    App.extend({
        run: function (next) {
            var self = this,
                newMenu = 0;

            self.menuObj = [];

            this.menuInit();

            $(document).on('click', '#saveChlidMenu', function () {
                self.saveData();
            });

            $nestable.on('mousedown', function (e) {
                var $itemCopy = $('.dd-placeholder', $nestable), $target, $item;

                if ($itemCopy.length === 0) {
                    return;
                }

                $target = $(e.target);
                $item = $target.closest("li");

                if ($target.is(".dd-handle")) {
                    if ($item.data('id') !== '') {
                        self.menuSign = $item.data('id');
                        self.signType = 'id';
                    }
                    else {
                        self.menuSign = $item.attr('new-build');
                        self.signType = 'build';
                    }
                }

                self.subMenuIndex = $itemCopy.index();
                self.dataRank = $item.data("rank");
                self.$parentMenu = $('.dd-placeholder').closest('li');
            })
                .on("change", function () {
                    var $thisMenu, dataRank, _index, flag, menuData,
                        $item = $(this);

                    if (self.signType === 'id') {
                        $thisMenu = $item.find("li[data-id='" + self.menuSign + "']");
                    } else if (self.signType === 'build') {
                        $thisMenu = $item.find("li[new-build='" + self.menuSign + "']");
                    }

                    _index = $thisMenu.index();

                    function changRank($item) {
                        var currentRank = $item.parent().closest('li').data('rank'),
                            storeParentId = self.$parentMenu.data('id'),
                            currentParentId = $item.parent().closest('li').data('id');

                        currentRank = isNaN(currentRank) ? 2 : currentRank + 1;

                        if (typeof dataRank === 'undefined') {
                            dataRank = currentRank;

                            if (self.dataRank === dataRank && self.subMenuIndex === _index
                                && storeParentId === currentParentId) {
                                return false;
                            }
                        }

                        $item.data('rank', currentRank).attr("data-rank", currentRank);

                        if (currentRank !== 3) {
                            $item.data("icon", "").attr("data-icon", "");
                            $item.children('.dd-content').find("i.menu-icon").remove();
                        } else {
                            if ($item.data("icon") === "") {
                                $item.data("icon", "fa-bars").attr("data-icon", "fa-bars");
                                $item.children('.dd-content').find("span.menu-name").prepend("<i class='menu-icon fa-bars'></i>");
                            }
                        }

                        if (currentRank === 2) {
                            $item.data("url", "").attr("data-url", "");
                        } else {
                            if ($item.find('li').size() < 1 && $item.data("url") === "") {
                                $item.data("url", "#").attr("data-url", "#");
                            }
                        }

                        if ($item.children('ol').children('li[data-text]').size() > 0) {
                            $item.children('ol').children('li[data-text]').each(function () {
                                changRank($(this));
                            });
                        }
                    }

                    flag = changRank($thisMenu, self.dataRank);

                    if (typeof flag !== 'undefined') {
                        return;
                    }

                    self.subType = 'change';

                    if ($thisMenu.data("type") !== "add") {
                        $thisMenu.data("type", "update").attr("data-type", "update");
                    }

                    if ($thisMenu.parent("ol").closest("li").data("url") !== "") {
                        $thisMenu.parent("ol").closest("li").data({"url": "", "type": "update"})
                            .attr({"data-url": "", "data-type": "update"});
                    }

                    if (self.$parentMenu.find('li').size() < 1) {
                        self.$parentMenu.data({"url": "#", "type": "update"})
                            .attr({"data-url": "#", "data-type": "update"});
                    }

                    menuData = self.menuData($nestable.find('.active').parent('li'));

                    self.submenuEdit(menuData);

                });

            $(document).on('click', '.top-menu > div[data-children]', function () { // 顶部菜单
                var $that = $(this),
                    updateMsg = function () {
                        $that.siblings('div[data-children]').removeClass('active');
                        $that.addClass('active');

                        self.submenuRender($that.data('children'));
                    };

                if ($('.page-aside-switch').is(':visible')) {
                    self.pageAside();
                }

                if (!$that.hasClass('active')) {

                    if (self.subType) {
                        parent.layer.confirm('您还未对修改过的信息进行保存，请先进行保存！', {
                            btn: ['保存', '不保存']
                        }, function (index) {
                            self.saveData(index);
                        }, function () {
                            self.subType = undefined;
                            self.menuObj = self.menuData($that);
                            updateMsg();
                        });

                        newMenu = 0;
                    } else {
                        self.subType = undefined;
                        self.menuObj = self.menuData($that);
                        updateMsg();
                    }
                }
            });

            $(document).on('click', '.nav-submenu', function () { // 小屏幕下顶部菜单展示
                $(".page-aside").removeClass('open');
            });

            $(document).on('click', '[data-tag="list-editable"], #addMenuToggle', function (e) { //添加|编辑顶部菜单
                self.topMenuDatas = self.menuData($(this).parents("div[data-children]"));

                e.stopPropagation();
            });

            // 顶部菜单模态框显示完成时 && 隐藏完成时
            $('#addMenu')
                .on('shown.bs.modal', function () {
                    var $that = $(this),
                        iframe = $that.find('iframe').prop('contentWindow').topMenus,
                        data = self.topMenuDatas;

                    iframe.$topMenuModal = $that;

                    if (typeof data.text !== 'undefined' && typeof data.icon !== 'undefined') {
                        iframe.topMenuEdit(data);
                    }

                    self.getAuth(data.id, iframe.authView());
                })
                .on('hide.bs.modal', function () {
                    var iframe = $(this).find('iframe').prop('contentWindow').topMenus,
                        currentMenuData = iframe.menuData,
                        topMenuId = self.topMenuDatas.id;

                    if(!currentMenuData){
                        return;
                    }

                    self.setMenu(currentMenuData, topMenuId);

                    if(typeof topMenuId === 'undefined'){
                        self.menuObj = currentMenuData;
                    }else{
                        $.extend(true, self.menuObj, currentMenuData);
                    }
                });

            $(document).on('click', '[data-tag="list-delete"]', function (e) { // 删除顶部菜单
                var $item = $(this).parents('div[data-children]'), str,
                    ID = $item.data('id'),
                    callback = function (index) {
                        if ($item.is('.active')) {
                            if ($item.next('[data-children]').size() > 0) {
                                $item.next().addClass('active');
                            } else if ($item.prev('[data-children]').size() > 0) {
                                $item.prev().addClass('active');
                            } else {
                                parent.layer.alert('您必须保留一个菜单！');
                                return;
                            }

                            str = $item.siblings('div[data-children].active').data('children');
                            self.submenuRender(str);
                        }

                        $item.remove();
                        toastr.success("菜单删除成功！");
                        parent.layer.close(index);
                    };

                parent.layer.confirm("您确定要删除该菜单吗？", function (index) {
                    $.ajax({
                        url: SERVER_PATH + '/user/system/menuDelete?id=' + ID,
                        type: 'POST',
                        dataType: 'JSON',
                        success: function (data) {
                            if (data.code==0) {
                                callback(index);
                            } else {
                                toastr.error(data.report);
                            }
                        },
                        error: function () {
                            toastr.error('服务器异常，请稍后再试！');
                        }
                    });
                });
                e.stopPropagation();
            });

            $(document).on('click', '[data-plugin="nestable"] .dd-content:not(.active)', function () {
                var $item = $(this).parent('li'),
                    menuData = self.menuData($item);

                $('[data-plugin="nestable"] .active').removeClass('active');
                $(this).addClass('active');

                self.submenuEdit(menuData);
            });

            $(document).on('focusout', 'input[name="submenu_name"]', function () {
                var thisVal = $(this).val(), icon,
                    $item = $nestable.find('.active').parent('li'),
                    storeVal = $item.data('text');

                if (thisVal === storeVal) {
                    return;
                } else if (thisVal === "") {
                    thisVal = storeVal;
                } else {
                    self.subType = 'change';
                    $item.data("text", thisVal).attr("data-text", thisVal);
                    if ($item.data('icon') !== '') {
                        icon = $item.data('icon');
                        $item.children("div.dd-content").children("span.menu-name").html('<i class="menu-icon ' + icon + '"></i> ' + thisVal);
                    } else {
                        $item.children("div.dd-content").children("span.menu-name").text(thisVal);
                    }

                    $('.menu-box h4').text(thisVal);

                    if ($item.data('type') !== 'add') {
                        $item.data('type', 'update').attr('data-type', 'update');
                    }
                }

                $(this).val(thisVal);
            });

            $(document).on('focusout', 'input[name="submenu_url"]', function () {
                var thisVal = $(this).val(),
                    $item = $nestable.find('.active').parent('li'),
                    storeVal = $item.data('url');

                if (thisVal === "") {
                    thisVal = storeVal;
                } else {
                    self.subType = 'change';
                    $item.data("url", thisVal).attr("data-url", thisVal);

                    if ($item.data('type') !== 'add') {
                        $item.data('type', 'update').attr('data-type', 'update');
                    }
                }

                $(this).val(thisVal);
            });

            $(document).on('change', 'select[name="submenu_limit"]', function () {
                var thisVal = $(this).val(),
                    auths = [],
                    $item = $nestable.find('.active').parent('li');

                self.subType = 'change';

                if (thisVal !== null) {
                    for (var n in thisVal) {
                        auths.push({id: thisVal[n]});
                    }
                }

                $item.data("auth", auths).attr("data-auth", auths);
                if ($item.data('type') !== 'add') {
                    $item.data('type', 'update').attr('data-type', 'update');
                }
            });

            $(document).on('click', '.delete-submenu', function () {
                var data, sure = false,
                    $item = $("[data-plugin='nestable']").find('.active').parent('li'),
                    ID = $item.data('id'),
                    delSubmenu = function (index) {
                        if ($item.next().size() > 0) {
                            $item.next().children('.dd-content').addClass('active');
                        } else if ($item.prev().size() > 0) {
                            $item.prev().children('.dd-content').addClass('active');
                        } else {
                            $item.parent("ol").closest("li").children('.dd-content').addClass('active');
                            $item.parent("ol").remove();
                            sure = true;
                        }

                        $item.remove();
                        toastr.success("菜单删除成功！");
                        parent.layer.close(index);

                        data = self.menuData($nestable.find('.active').parent('li'));

                        if (sure) {
                            data.url = "#";
                        }

                        if ($("[data-plugin='nestable']").find("li").size() < 1) {
                            $topMenu.find("div[data-children].active").data('children', 'null').attr('data-children', 'null');

                            self.isShow('hide');
                            return;
                        }

                        self.submenuEdit(data);
                        location.reload(true);
                    };

                parent.layer.confirm("您确定要删除该菜单吗？", function (index) {
                    if (ID !== "") {
                        $.ajax({
                            url: SERVER_PATH + '/user/system/menuDelete?id=' + ID,
                            type: 'POST',
                            dataType: 'JSON',
                            success: function (data) {
                                if (data.code==0) {
                                    delSubmenu(index);
                                } else {
                                    toastr.error("出错了，请重试！");
                                }
                            },
                            error: function () {
                                toastr.error("服务器异常，请稍后再试！");
                            }
                        });
                    } else if ($("[data-plugin='nestable']").find('li').length >= 1) {
                        delSubmenu(index);
                    } else {
                        self.subType = '';
                        $item.remove();
                        self.isShow('hide');
                    }
                });
            });

            $(document).on('click', ".add-submenu", function () {
                var $item = $(this), menuData, $liActive, dataRrank, flag;

                newMenu++;
                self.subType = 'change';

                if ($(".nav-submenu").hasClass('vertical-align')) {
                    menuData = [{
                        text: "自定义菜单一",
                        type: "add",
                        url: "#"
                    }];
                    self.submenuRender(menuData);
                    return;
                }

                $liActive = $('[data-plugin="nestable"] .active').parent('li');
                dataRrank = $liActive.data("rank");
                flag = self.insertChildMenu($item, $liActive, dataRrank, newMenu);

                if (typeof flag === 'undefined') {
                    menuData = self.menuData($nestable.find('.active').parent('li'));

                    self.submenuEdit(menuData);
                }
            });

            next();
        },
        updateOrder: function ($item) {
            var order = [];
            $item.children('.list-group-item').each(function () {
                order.push({
                    "id": $(this).data('id'),
                    "orderNo": $(this).index()
                });
            });

            $.ajax({
                url: $.ctx + '/menu/updateTopOrder',
                type: 'POST',
                data: {topMenus: JSON.stringify(order)},
                dataType: 'JSON',
                success: function (data) {
                    if (data.success) {
                        toastr.success('重新登录可更新顶部菜单！');
                    } else {
                        toastr.error('出错了，请重试！');
                    }
                },
                error: function () {
                    toastr.error('服务器异常，请重试！');
                }
            });
        },
        saveData: function (index) {
            var self = this;
            this.menuObj.children = $nestable.nestable('serialize');

            $.ajax({
                url: SERVER_PATH+ '/user/system/menuSave',
                type: 'POST',
                data: {menu: JSON.stringify(this.menuObj)},
                dataType: 'JSON',
                success: function (data) {
                    if (data.code == 0) {
                        self.subType = undefined;

                        toastr.info("当前菜单保存成功，重新登录可更新菜单数据！");
                        location.reload(true);
                        parent.layer.close(index);
                    } else {
                        toastr.error('保存失败，请重新保存！');
                    }
                },
                error: function () {
                    toastr.error('服务器异常，请稍后再试!');
                }
            });
        },
        menuData: function (doc) {
            return {
                id: doc.data('id'),
                url: doc.data('url'),
                text: doc.data('text'),
                icon: doc.data('icon'),
                layer: doc.data('layer')
            };
        },
        setMenu: function (data, ID) {
            var $navMenu;

            if (ID) {
                $navMenu = $topMenu.find('div[data-id="' + ID + '"]');

                $navMenu.data({
                    "text": data.text,
                    "icon": data.icon,
                    "limit": data.limit,
                    "type": data.type
                }).attr({
                    "data-text": data.text,
                    "data-icon": data.icon,
                    "data-limit": data.limit,
                    "data-type": data.type
                });

                $navMenu.find(".top_menuname").text(data.text);
                $navMenu.find("i.topmenu-icon").removeClass().addClass("icon topmenu-icon " + data.icon);

                if (!$navMenu.hasClass('active')) {
                    return;
                }

                if ($navMenu.data('children') === null) {
                    this.isShow('hide');
                } else {
                    this.isShow('show');
                }

                return;
            }

            $topMenu.find("div[data-children].active").removeClass('active');
            data = [data];

            this.menuRender(data);
        },
        getAuth: function (ID, fn) {
            $.ajax({
                url: SERVER_PATH + '/user/system/roleList',
                data: {menuId: ID},
                dataType: 'JSON',
                success: function (data) {
                    var html = '', selected,
                        callback = function (options) {
                            if (options.permission) {
                                selected = 'selected';
                            } else {
                                selected = '';
                            }

                            html += '<option value="' + options.id + '" ' + selected + '>'
                                + options.text + '</option>';
                        };

                    if (data.code == 0) {
                        for (var i = 0; i < data.data.length; i++) {
                            callback(data.data[i]);
                        }

                        fn(html);
                    } else {
                        toastr.error("出错了，请重试！");
                    }
                },
                error: function () {
                    toastr.error('服务器异常，请稍后再试！');
                }
            });
        },
        menuInit: function () {
            var self = this;

            $.ajax({
               // url: $.ctx + '../../../public/data/system/menu.json',
                url: SERVER_PATH + '/user/system/menuList',
                dataType: 'JSON',
                success: function (data) {
                    self.menuRender(data.data);
                },
                error: function () {
                    toastr.error('服务器异常，请稍后再试！');
                }
            });
        },
        menuRender: function (menu) {
            var self = this,
                data = {}, html;

            data.navMenu = menu;

            template.helper('json_str', function (submenu) {
                submenu = JSON.stringify(submenu);

                return submenu;
            });
            html = template('navMenu', data);

            $topMenu.append(html);

            $topMenu.sortable({
                disableIEFix: true
            }).on('sortupdate', function () { // 顶部菜单拖拽移动排序
                self.updateOrder($(this));
            });

            this.submenuRender($topMenu.children("div[data-children].active").data('children'));

            if (this.menuObj.type !== 'add') {
                this.menuObj = this.menuData($topMenu.children("div[data-children].active"));
            }
        },
        isShow: function (opt) {
            var $submenu = $(".nav-submenu"),
                $navMenu = $topMenu.find("div[data-children].active"),
                $noSubMenu = $submenu.children(".no-submenu"),
                $pContent = $submenu.children(".page-content");

            if (opt === 'hide') {
                if (!$submenu.hasClass('vertical-align')) {
                    $submenu.removeClass("has-submenu").addClass("vertical-align");
                    $pContent.hide();
                    $noSubMenu.removeClass("hidden");
                }

                $noSubMenu.find("i.topmenu-icon").addClass($navMenu.data("icon"));
                $noSubMenu.find(".nav-menu-name").html($navMenu.data("text"));

            } else {
                if ($submenu.hasClass('vertical-align')) {
                    $submenu.addClass("has-submenu").removeClass("vertical-align");
                    $pContent.show();
                    $noSubMenu.find("i").removeClass().addClass("icon topmenu-icon");
                    $noSubMenu.addClass("hidden");
                }
            }
        },
        submenuRender: function (obj) {
            var data, html, menuData;
            obj = typeof obj === 'string' ? JSON.parse(obj) : obj;

            if (obj === null) {
                this.isShow('hide');
            } else {
                data = {menu: obj};
                html = template('childMenu', data);

                $nestable.html(html);

                menuData = this.menuData($nestable.find('.active').parent('li'));

                this.submenuEdit(menuData);

                this.isShow('show');
            }
        },
        submenuEdit: function (menuData) {
            var self = this,
                html = template('menuInfo', menuData),
                iconView = function (val) {
                    var $item = $nestable.find('.active').parent('li');

                    self.subType = 'change';
                    $item.data("icon", val).attr("data-icon", val);
                    $item.children("div.dd-content").children("span.menu-name").children('i.menu-icon').removeClass().addClass("menu-icon " + val);

                    if ($item.data('type') !== "add") {
                        $item.data('type', 'update').attr('data-type', 'update');
                    }
                };

            $('.menu-info').html(html);

            this.getAuth(menuData.id, function (tpl) {
                var $select = $('select[name="submenu_limit"]');

                $select.html(tpl);
                $select.selectpicker($.po('selectpicker'));
            });

            $('.icp-dd1').iconpicker($.po('iconpicker', {title: '请选择菜单图标'}))
                .on('iconpickerSelected', function (e) {
                    iconView(e.iconpickerValue);
                });

        },
        insertChildMenu: function ($item, $liActive, dataRrank, newMenu) {
            var callback = function (icon) {
                var html;

                if (icon) {
                    html = '<li class="dd-item dd-item-alt" data-id="" data-auth="" data-rank="'
                        + dataRrank + '" new-build="' + newMenu + '" data-text="自定义菜单" data-url="'
                        + '#" data-icon="fa-bars" data-type="add"><div class="dd-handle"></div>' +
                        '<div class="dd-content active"><span class="menu-name"><i class="menu-icon' +
                        ' fa-bars"></i> 自定义菜单</span><span class="pull-right fa-angle-right">' +
                        '</span></div></li>';
                } else {
                    html = '<li class="dd-item dd-item-alt" data-id="" data-auth="" data-rank="' + dataRrank +
                        '" new-build="' + newMenu + '" data-text="自定义菜单" data-url="#" data-icon="" data-type="add">' +
                        '<div class="dd-handle"></div><div class="dd-content active"><span class="menu-name">自定义菜单' +
                        '</span><span class="pull-right fa-angle-right"></span></div></li>';
                }

                return html;
            };

            if ($item.hasClass("after")) {
                if (dataRrank === 3) {
                    $liActive.after(callback('icon'));
                } else {
                    $liActive.after(callback());
                }
            }

            if ($item.hasClass("append")) {
                if (dataRrank >= 5) {
                    toastr.warning("已经是最后一级菜单，不能再为其添加子菜单了！");
                    newMenu--;
                    return false;
                }

                if ($liActive.find("ol").size() === 0) {
                    $liActive.append('<ol class="dd-list"></ol>');
                    $liActive.data("url", "").attr("data-url", "");
                }

                dataRrank = Number(dataRrank) + 1;

                if (dataRrank === 3) {
                    $liActive.children("ol").append(callback('icon'));
                } else {
                    $liActive.children("ol").append(callback());
                }
            }
            $nestable.find('.active:first').removeClass("active");
        }
    });

    App.run();

})();