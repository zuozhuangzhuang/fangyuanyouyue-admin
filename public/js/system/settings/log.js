/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (document, window, $) {
    "use strict";

    var oTable, $thisRow,
        $logModal = $('#logsForm'),
        $logForm = $('#compileRoleForm');

    oTable = $('.dataTable').DataTable($.po('dataTable', {
        autoWidth: false,
        processing: true,
        rowId: "configId",
        columns: [
            {"data": "url"},
            {"data": "type"},
            {"data": "createUser.loginName"},
            {"data": "createTime"},
            {
                "render": function () {
                    return '<div class="btn-group btn-group-sm"><button type="button"' +
                        ' class="btn btn-icon btn-pure btn-default edit-row" data-target="#logsForm"' +
                        ' data-toggle="modal"><i class="icon wb-edit" aria-hidden="true"></i>' +
                        '</button><button type="button" class="btn btn-icon btn-pure btn-default' +
                        ' delete-row"><i class="icon wb-close" aria-hidden="true"></i></button></div>';
                }
            }
        ]
    }));

    var logForm = $logForm.validate({
        rules: {
            url: {
                required: true
            },
            type: {
                required: true
            }
        },
        messages: {
            url: {
                required: '请填写URL地址'
            },
            type: {
                required: '请填写URL对应名称'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            var logConfig = {
                    url: $form.find('[name="url"]').val(),
                    type: $form.find('[name="type"]').val()
                },
                ID = $thisRow === null ? '' : oTable.row($thisRow).id();

            function changeTable(obj) {
                if ($thisRow !== null) {
                    $thisRow.find('td:eq(0)').text(obj.url);
                    $thisRow.find('td:eq(1)').text(obj.type);
                    toastr.success('修改成功！');
                } else {
                    oTable.row.add(obj).draw(false);
                    toastr.success('添加成功！');
                }
            }

            $.ajax({
                url: $.ctx + '/log/saveConfig?configId=' + ID,
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    if (data.success) {
                        logConfig.configId = data.config.configId;
                        logConfig.createTime = data.config.createTime;
                        logConfig.createUser = data.config.createUser;

                        $logModal.one('hidden.bs.modal', function () {
                            changeTable(logConfig);
                        }).modal('hide');
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

    $logModal.on('hide.bs.modal', function () { // 模态窗隐藏后
        logForm.resetForm();
    });

    $(document).on('click', '.delete-row', function () { // 删除当前日志
        var $item = $(this).closest('tr'), ID,
            $tr = $item.prev();

        if ($item.hasClass('child') && $tr.hasClass('parent')) {
            $item = $tr;
        }
        ID = oTable.row($item).id();

        parent.layer.confirm('你确定要删除吗？', function (index) {
            $.ajax({
                url: $.ctx + '/log/deleteConfig?configId=' + ID,
                type: 'POST',
                data: {id: ID},
                dataType: 'JSON',
                success: function (data) {
                    if (data.success) {
                        oTable.row($item).remove().draw(false);
                        toastr.success('删除成功！');
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
    });

    $(document).on('click', '.add-row', function () { // 新增日志
        $thisRow = null;
    });

    $(document).on('click', '.edit-row', function () { // 编辑当前日志
        $thisRow = $(this).closest('tr');
        var rowData = {
            url: $thisRow.find('td:eq(0)').text(),
            type: $thisRow.find('td:eq(1)').text()
        };

        $logForm.find('input[name="url"]').val(rowData.url);
        $logForm.find('input[name="type"]').val(rowData.type);
    });

})(document, window, jQuery);