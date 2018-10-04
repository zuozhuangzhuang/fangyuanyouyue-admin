/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
"use strict";
(function (window, document, $) {
    var timer = null, $jstree = $('#jstree'), $roleInfo = $('#roleInfo');

    var roleModal = window.roleModal = {
        storeData: null,
        $roleForm: null,
        roleInfo: function (data) {
            var roleId = data.id;

            if (typeof roleId !== 'undefined') {
                $roleInfo.find('input[name="roleName"]').val(data.name);
                $roleInfo.find('input[name="roleId"]').val(roleId);
            } else {
                roleId = -1;
            }

            $jstree.data('jstree', false).empty().jstree({
                "checkbox": {
                    "keep_selected_style": false
                },
                "plugins": ["checkbox", "search"],
                "core": {
                    'data': {
                        "url": SERVER_PATH + '/user/system/roleMenuList?roleId=' + roleId,
                        "dataType": "JSON"
                    }
                }
            });

            $('#slimScroll').slimScroll($.po('slimScroll', {
                height: '240px'
            }));
        }
    };

    // 搜索树节点
    $(document).on('keyup', 'input[name="jstree_search"]', function () {
        var $item = $(this);
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(function () {
            var v = $item.val();
            $jstree.jstree(true).search(v);
        }, 250);
    });

    // 展开所有树节点
    $(document).on('click', '.btn-unfold', function () {
        $jstree.jstree().open_all();
    });

    // 折叠所有树节点
    $(document).on('click', '.btn-fold', function () {
        $jstree.jstree().close_all();
    });

    // 保存角色菜单权限信息
    $(document).on('click', ".btn-jstree", function () {
        var data = [],
            checkedData = $jstree.jstree("get_checked"),
            treeData = function ($el) {
                var $items = $el.children('ul').children('li'), i = 0;

                for (; i < $items.length; i++) {
                    if ($items.eq(i).attr("aria-selected") === "true" || $items.eq(i).children('a').find('i.jstree-undetermined').length) {
                        data.push($items.eq(i).prop('id'));
                    }

                    if ($items.eq(i).children("ul").length) {
                        treeData($items.eq(i));
                    }
                }
            }, treeArry = function (checkedData) {
                var item = checkedData.shift(),
                    temp = [];

                for (var n in data) {
                    if (item !== data[n]) {
                        temp.push(item);
                    }
                }

                if (temp.length === data.length) {
                    data.push(item);
                }

                if (checkedData.length) {
                    treeArry(checkedData);
                }
            };

        treeData($jstree);
        treeArry(checkedData);

        $roleInfo.find('input[name="roleAuth"]').val(data);
    });

    $roleInfo
        .validate({
            rules: {
                roleName: {
                    required: true
                }
            },
            submitHandler: function (form) {
                var $form = $(form);
                var storeData = roleModal.storeData = {
                        role: {
                            name: $form.find('[name="roleName"]').val()
                        }
                    };

                $.ajax({
                    url: SERVER_PATH + '/user/system/roleSave',
                    type: 'POST',
                    data: $form.serialize(),
                    dataType: 'JSON',
                    success: function (data) {
                        if (data.success) {
                            storeData.role.id = data.id;

                            roleModal.$roleForm.modal('hide');
                        } else {
                            toastr.error('出错了，请重试！');
                        }
                    },
                    error: function () {
                        toastr.error('服务器异常，请稍后再试！');
                    }
                });
            }
        });
})(window, document, jQuery);