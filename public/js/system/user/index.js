/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
"use strict";
(function (document, window, $) {
    var $userInfroModal = $('#userInfoForm');

    App.extend({
        handleAction: function () {
            var self = this,
                actionBtn = $('.site-action').actionBtn().data('actionBtn'),
                $selectable = $('.dataTable');

            $selectable.asSelectable($.po('selectable', $(this).data()));

            // 新增用户
            $('.site-action-toggle').on('click', function (e) {
                self.currentRow = undefined;
                self.getAuth();

                $userInfroModal.modal('show');
                e.stopPropagation();
            });

            // 用户信息模态窗显示 && 隐藏时相关操作
            $userInfroModal
                .modal({
                    show: false,
                    pageHeight: 480,
                    page: $.ctx + '../../html/system/user/_user-info.html'
                })
                .on('shown.bs.modal', function () {
                    var iframe = $(this).find('iframe').prop('contentWindow').userModal;

                    iframe.authView(self.authData, {$currentRow: self.$item, table: self.table, $el: $userInfroModal});

                    if (typeof self.currentRow !== 'undefined') {
                        iframe.editUser(self.currentUser, self.currentRow);
                    } else {
                        iframe.addUser();
                    }
                });

            // 删除所选用户
            $(document).on('click', '[data-action="delete"]', function () {
                var $tr = $('#user_tables').find('tbody > tr'),
                    userIds = [];

                parent.layer.confirm("您确定要删除所选用户吗？", function (index) {
                    $tr.each(function () {
                        if ($(this).find(':checkbox').is(':checked')) {
                            userIds.push(self.table.row($(this)).data().userId);
                        }
                    });

                    $.ajax({
                        url: $.ctx + '/user/delete',
                        type: 'POST',
                        data: {userId: userIds},
                        traditional: true,
                        dataType: 'JSON',
                        success: function (data) {
                            if (data.success) {
                                $tr.each(function () {
                                    if ($(this).find(':checkbox').is(':checked')) {
                                        self.table.row($(this)).remove().draw(false);
                                    }
                                });

                                toastr.success('删除成功！');
                                parent.layer.close(index);
                                actionBtn.hide();
                            } else {
                                toastr.error('出错了，请重试！');
                            }
                        },
                        error: function () {
                            toastr.error('服务器异常，请稍后再试！');
                        }
                    });
                }, function () {
                    actionBtn.hide();
                });
            });

            // 禁用选中用户
            $(document).on('click', '[data-action="move"]', '.site-action', function () {
                var $tr = $('#user_tables').find('tbody > tr'),
                    userIds = [];

                parent.layer.confirm('你确定要禁用所选用户吗？', function (index) {
                    $tr.each(function () {
                        if ($(this).find(':checkbox').is(':checked')) {
                            userIds.push(self.table.row($(this)).data().userId);
                        }
                    });

                    $.ajax({
                        url: $.ctx + '/user/forbid',
                        type: 'POST',
                        data: {userId: userIds},
                        traditional: true,
                        dataType: 'JSON',
                        success: function (data) {
                            if (data.success) {
                                $tr.each(function () {
                                    if ($(this).find(':checkbox').is(':checked')) {
                                        $(this).addClass('disabled');
                                        self.table.row($(this)).data().state = 'FORBIDDEN';
                                    }
                                });

                                toastr.success('已禁用选中用户！');
                                parent.layer.close(index);
                                actionBtn.hide();
                            } else {
                                toastr.error('出错了，请重试！');
                            }
                        },
                        error: function () {
                            toastr.error('服务器异常，请稍后再试！');
                        }
                    });
                }, function () {
                    actionBtn.hide();
                });
            });

            // 表格选中项对应右下角按钮状态
            $(document).on('asSelectable::change', '.dataTable', function (e, api, checked) {
                if (checked) {
                    actionBtn.show();
                } else {
                    actionBtn.hide();
                }
            });
        },
        handleListItem: function () {
            var self = this;

            // 删除当前角色
            $(document).on('click', '[data-tag="list-delete"]', function (e) {
                var $item = $(this).closest("div.list-group-item"),
                    dataUser = $item.attr("data-user"),
                    dataId = $item.attr("data-id");

                parent.layer.confirm("您确定要删除该角色吗？", function (index) {
                    $.ajax({
                        url: $.ctx + '/role/delete?roleId=' + dataId,
                        type: 'POST',
                        dataType: 'JSON',
                        success: function (data) {
                            var $itemNext, $itemPrev, _callback = self.currentRole;

                            if (data.success) {
                                $itemNext = $item.next('.list-group-item');
                                $itemPrev = $item.prev('.list-group-item');
                                self.allUsers -= dataUser;
                                $("[data-allUsers]").attr("data-allUsers", self.allUsers).text(self.allUsers);

                                if ($itemNext.length) {
                                    _callback.call(self, $itemNext);
                                } else if ($itemPrev.length) {
                                    _callback.call(self, $itemPrev);
                                } else {
                                    _callback.call(self, $('#allUsers'));
                                }

                                $item.remove();
                                toastr.success("角色删除成功！");
                                parent.layer.close(index);
                            } else {
                                toastr.error(data.msg);
                            }
                        },
                        error: function () {
                            toastr.error('服务器异常，请稍后再试！');
                        }
                    });
                });

                e.stopPropagation();
            });

            // 选中当前角色，加载相关用户
            $(document).on('click', '.page-aside-inner .page-aside-section:not(.hidden-xs) .list-group-item', function () {
                self.currentRole($(this));
            });
        },
        handleTable: function () {
            var self = this;

            this.table = $('.dataTable').DataTable($.po('dataTable', {
                dom: '<"row"<"col-xs-6"<"hidden-xs"B>><"col-xs-6"f>><"row"<"col-xs-12"tr>><"row"<"col-sm-5"i><"col-sm-7"p>>',
                processing: true,
                autoWidth: false, //禁用自动调整列宽
                ajax: $.ctx + '../../../public/data/system/user.json',
                rowId: 'userId',
                buttons: {
                    dom: {
                        container: {
                            className: 'btn-group btn-group-sm'
                        },
                        button: {
                            className: 'btn btn-default btn-outline'
                        }
                    },
                    buttons: [
                        {
                            extend: 'copy',
                            text: '拷贝'
                        },
                        {
                            extend: 'excel',
                            text: '导出 Excel'
                        },
                        {
                            extend: 'csv',
                            text: '导出 CSV'
                        },
                        {
                            extend: 'print',
                            text: '打印'
                        }
                    ]
                },
                columns: [
                    {
                        "render": function () {
                            var checkbox = '<span class="checkbox-custom checkbox-primary">' +
                                '<input type="checkbox" class="contacts-checkbox selectable-item">' +
                                '<label></label></span>';
                            return checkbox;
                        }
                    },
                    {"data": "loginName"},
                    {"data": "createTime"},
                    {"data": "lastLoginTime"},
                    {"data": "loginCount"},
                    {"data": "lastLoginIp"},
                    {
                        "render": function () {
                            var edit = '<button type="button" class="btn btn-sm btn-icon btn-pure btn-default"' + ' data-toggle="edit"><i class="icon wb-edit" aria-hidden="true"></i></button>';
                            return edit;
                        }
                    }
                ],
                rowCallback: function (row, data) {
                    if (data.state === "FORBIDDEN") {
                        $(row).addClass('disabled');
                    }

                    if (data.userId === self.currentUser) {
                        $(row).find('input:checkbox').prop('disabled', true);
                    }
                }
            }));
        },
        handleEdit: function () {
            var self = this;

            // 编辑当前用户信息
            $(document).on('click', '.page-users button[data-toggle=edit]', function () {
                var $item = $(this).closest('tr'),
                    $currentRow = $item.prev();

                if ($item.hasClass('child') && $currentRow.hasClass('parent')) {
                    $item = $currentRow;
                }

                self.$item = $item;
                self.currentRow = self.table.row($item).data();

                self.getAuth();

                $userInfroModal.modal('show');
            });

            // 添加 && 编辑角色信息
            $(document).on('click', '.btn-edit, #addRoleToggle', function (e) {
                var $item = $(this);

                self.$currentRole = $item.closest('div.list-group-item');
                self.roleInfo = {
                    id: $item.parents('div.list-group-item').attr('data-id'),
                    name: $item.parent().prev('span.list-text').text()
                };

                e.stopPropagation();
            });

            // 角色模态窗显示完成时 && 隐藏完成时
            $('#roleForm')
                .on('shown.bs.modal', function () {
                    var $that = $(this),
                        iframe = $that.find('iframe').prop('contentWindow').roleModal;

                    iframe.$roleForm = $that;
                    iframe.roleInfo(self.roleInfo);
                })
                .on('hide.bs.modal', function () {
                    var iframe = $(this).find('iframe').prop('contentWindow').roleModal,
                        storeData = iframe.storeData, html,
                        $roleContent = $('.role-contents');

                    if (!storeData) {
                        return;
                    }

                    html = template('roleTpl', storeData);

                    if (!self.roleInfo.id) {
                        $roleContent.append(html);
                    } else {
                        self.$currentRole.find('span.list-text').text(storeData.role.name);
                    }
                });
        },
        getAuth: function () {
            var self = this,
                currentRow = self.currentRow,
                userId = typeof currentRow === 'undefined' ? -1 : currentRow.userId;

            $.ajax({
                url: $.ctx + '/public/data/system/auth.json?userId=' + userId,
                dataType: 'JSON',
                success: function (data) {
                    if (data.success) {
                        self.authData = data;
                    } else {
                        toastr.error('出错了，请重试！');
                    }
                },
                error: function () {
                    toastr.error('服务器异常，请稍后再试！');
                }
            });
        },
        currentRole: function ($item) {
            var $parents = $('.page-aside-inner'),
                ID = $item.attr('data-id'),
                url = $.ctx + (typeof ID === 'undefined' ? '/public/data/system/user.json' : '/public/data/system/user.json?roleId=' + ID);

            if (!$item.is('.active')) {
                $parents.find('.list-group-item').removeClass('active');
                $item.addClass('active');
                this.table.ajax.url(url).load();
            }
        },
        run: function (next) {
            this.currentUser = $('#admui-signOut', $.parentFrame).data('user');
            this.allUsers = $("[data-allUsers]").attr("data-allUsers");

            this.handleTable();
            this.handleAction();
            this.handleListItem();
            this.handleEdit();

            next();
        }
    });

    App.run();

})(document, window, jQuery);
