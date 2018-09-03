/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    'use strict';

    var accountMsg = {
        loadMsg: function (page) { // 加载当前页通知
            var html;

            template.helper('iconType', function (type) {
                switch (type) {
                    case 'SYSTEM':
                        return 'fa-desktop system';
                    case 'TASK':
                        return 'fa-tasks task';
                    case 'SETTING':
                        return 'fa-cog setting';
                    case 'EVENT':
                        return 'fa-calendar event';
                    default:
                        return 'fa-comment-o other';
                }
            });
            template.helper('timeMsg', function (date) {
                var msgTime, arr,
                    currentTime = new Date();

                // ios new Data兼容
                arr = date.split(/[- : \/]/);
                msgTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);

                return window.notifyFn.timeDistance(msgTime, currentTime);

            });

            $.ajax({
                url: $.ctx + '/public/data/system/message.json?page=' + page,
                dataType: 'JSON',
                success: function (data) {
                    if (data.success) {
                        html = template('newMessge', data);
                        $('#messageLists').html(html);
                    } else {
                        toastr.error('出错了，请重试！');
                    }
                },
                error: function () {
                    toastr.error('服务器异常，请稍后再试！');
                }
            });
        },
        fnExtend: function () { // 扩展notifyFn对象，便于socket消息通知中回调操作
            var self = this;

            $.extend(window.notifyFn, {
                messagePage: function () { // 在消息页面时的操作
                    var $adminMsg = $('#messageLists');

                    if (!$('#accountMsg').hasClass('active')) {
                        return;
                    }

                    if ($adminMsg.children('.no-message').length !== 0 || $('#paging').data('page') === 1) {
                        self.loadMsg('');
                    }
                },
                msgStatus: function (Id) { // 改变消息状态
                    var $element = $('[data-message-id="' + Id + '"]').children('.media'),
                        $readTab = $element.children(".media-right").find("a"),
                        $title = $element.children(".media-body").find("i");

                    $title.remove();
                    $readTab.attr("title", "删除");
                    $readTab.removeClass("wb-check").addClass("wb-close");
                }
            });
        },
        run: function () {
            var self = this, fn = window.notifyFn.unReadMsg;

            this.loadMsg('');
            this.fnExtend();

            if (fn && $.isFunction(fn)) {
                fn($('#admui-navbarMessage').find('span.msg-num').text());
            }

            // 查看当前消息
            $(document).on("click", ".news-list", function (e) {
                e.preventDefault();

                var $that = $(this),
                    opts = $that.parents(".list-group-item").data();

                opts.readFlag = $that.find("i.icon").size() <= 0;
                window.notifyFn.readMsg(opts);
            });

            // 直接更改状态为已读
            $(document).on("click", ".wb-check", function (e) {
                e.preventDefault();

                window.notifyFn.readMsg($(this).parents('[data-message-id]').data());
            });

            // 删除已读消息
            $(document).on("click", ".wb-close", function (e) {
                e.preventDefault();
                var $item = $(this).closest(".list-group-item"),
                    $total = $('.msg-number'),
                    total = Number($total.text()),
                    page = $('#paging').data('page'),
                    ID = $item.data('messageId');

                parent.layer.confirm("你确定要删除吗？", function (index) {
                    $.ajax({
                        url: $.ctx + '/message/delete',
                        type: 'POST',
                        data: {messageId: ID},
                        dataType: 'JSON',
                        success: function (data) {
                            if (data.success) {
                                self.loadMsg(page);

                                total--;
                                $total.text(total);

                                toastr.clear();
                                toastr.success('删除成功！');
                                parent.layer.close(index);
                            } else {
                                toastr.error('出错了，请重试！');
                            }
                        },
                        error: function () {
                            toastr.error('服务器异常，请稍后再试！');
                        }
                    });
                });
            });

            // 分页
            $(document).on('click', '.previous, .next', function () {
                var $item = $(this),
                    page = $item.parents('#paging').data('page'),
                    maxPage = $item.parents('#paging').data('max-page'),
                    $prev = $('.previous'),
                    $next = $('.next');

                if ($item.is('.previous')) {
                    if ($next.is(':hidden')) {
                        $next.show();
                    }
                    if (page === 2) {
                        $prev.hide();
                    }
                    page--;
                }
                else if ($item.is('.next')) {
                    if ($prev.is(':hidden')) {
                        $prev.show();
                    }
                    if (page === maxPage - 1) {
                        $next.hide();
                    }
                    page++;
                }
                self.loadMsg(page);
            });
        }
    };

    accountMsg.run();
})(window, document, jQuery);
