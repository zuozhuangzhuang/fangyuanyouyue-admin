/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
"use strict";
(function (window, document, $) {

    var $userAccount = $("#userAccountInfo");

    var userModal = window.userModal = {
        addUser: function () {
            $userAccount.find("input[name='loginName']").removeAttr("readonly").val("");
            $userAccount.find("input[name='userId']").val("");
        },
        editUser: function (currentUser, currentRow) {
            var $checkbox = $userAccount.find('input:checkbox');

            this.currentRow = currentRow;

            $userAccount.find("input[name='loginName']").attr("readonly", "").val(currentRow.loginName);
            $userAccount.find("input[name='userId']").val(currentRow.userId);

            if (currentRow.userId === currentUser) {
                $checkbox.prop('disabled', true);
            } else {
                if (currentRow.state === 'FORBIDDEN') {
                    $checkbox.prop("checked", true).val('FORBIDDEN');
                }
            }
        },
        authView: function (data, others) {
            var html;

            $.extend(true, this, others);

            template.helper('authVal', function (auth) {
                if (auth) {
                    return 'selected';
                }
            });

            html = template('userAuth', data);

            $('select[name="roleIds"]').html(html).multiSelect('refresh');
        }
    };

    // 禁用选中用户
    $userAccount.find("input:checkbox").change(function () {
        var $item = $(this);

        if ($item.is(":checked")) {
            $item.val('FORBIDDEN');
        } else {
            $item.val('NORMAL');
        }
    });

    $userAccount.validate({
        rules: {
            loginName: {
                required: true
            },
            password: {
                required: function () {
                    return $userAccount.find('[name="loginName"]').attr('readonly') !== 'readonly';
                },
                minlength:6,
                maxlength:30
            },
            confirm: {
                required: function () {
                    return $userAccount.find('[name="loginName"]').attr('readonly') !== 'readonly';
                },
                equalTo: '#password'
            },
            limit: {
                required: true
            }
        },
        messages: {
            required: '账号信息不能为空',
            password: {
                required: '密码不能为空',
                minlength:'密码必须大于6个字符',
                maxlength:'密码必须小于30个字符'
            },
            confirm: {
                required: '确认密码不能为空',
                equalTo:'确认密码必须和密码保持一致'
            },
            limit: {
                required: '必须选中一个角色'
            }
        },
        errorPlacement: function (error, element) {
            var $inputGroup = element.parents('.strength-container');
            var $validElement = $inputGroup.length === 0 ? element : $inputGroup;

            error.addClass("help-block");

            element.parents(".form-group").addClass("has-feedback");

            error.insertAfter($validElement);
        },
        submitHandler: function (form) {
            var $form = $(form);

            $.ajax({
                url: $.ctx + '/user/save',
                type: 'POST',
                data: $form.serialize(),
                dataType: 'JSON',
                success: function (data) {
                    var table = userModal.table,
                        $currentRow = userModal.$currentRow,
                        _callback = function () {
                            var state = $form.find('[name="state"]').val();
                            table.row($currentRow).data().state = state;

                            if (state === "NORMAL") {
                                if ($currentRow.hasClass('disabled')) {
                                    $currentRow.removeClass('disabled');
                                }
                            } else if (state === "FORBIDDEN") {
                                if (!$currentRow.hasClass('disabled')) {
                                    $currentRow.addClass('disabled');
                                }
                            }
                        };

                    if (data.success) {
                        if (typeof userModal.currentRow !== 'undefined') {
                            _callback();
                        } else {
                            table.row.add(data.user).draw(false);
                        }

                        userModal.$el.modal('hide');
                        toastr.success(data.msg);
                    } else {
                        toastr.error(data.msg);
                    }
                },
                error: function () {
                    toastr.error('服务器异常，请稍后再试！');
                }
            });
        }
    });
})(window, document, jQuery);