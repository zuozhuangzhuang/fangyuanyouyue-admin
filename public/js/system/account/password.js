/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    'use strict';

    // 验证密码是否有效
    $.validator.addMethod('validPwd', function (value) {
        var result = false;

        $.ajax({
            url: $.ctx + '/user/check',
            type: 'POST',
            async: false,
            data: {oldPwd: value},
            dataType: 'JSON',
            success: function (data) {
                result = data.success;
            },
            error: function () {
                toastr.error('服务器异常，请稍后再试！');
            }
        });

        return result;
    }, '请填写正确的密码');

    // 密码修改表单验证等相关操作
    $('#accountMsg')
        .validate({
            rules: {
                oldPwd: {
                    required: true,
                    validPwd: true
                },
                newPwd: {
                    required: true,
                    minlength: 6,
                    maxlength: 30
                },
                confirm: {
                    required: true,
                    equalTo: '#newPwd'
                }
            },
            messages: {
                oldPwd: {
                    required: '密码不能为空'
                },
                newPwd: {
                    required: '密码不能为空',
                    minlength: '密码必须大于等于6个字符',
                    maxlength: '密码必须小于等于30个字符'
                },
                confirm: {
                    required: '确认密码不能为空',
                    equalTo: '确认密码必须和密码保持一致'
                }
            },
            submitHandler: function (form) {
                $.ajax({
                    url: $.ctx + '/user/changePassword',
                    type: 'POST',
                    data: {password: $(form).find('[name="confirm"]').val()},
                    dataType: 'JSON',
                    success: function (data) {
                        var time = 5, timer;

                        if (data.success) {
                            parent.layer.alert('<p id="modifyPwd"><span>' + time + '</span>秒后将自动跳转到登录页面</p>');

                            timer = setInterval(function () {
                                time--;
                                $('#modifyPwd span').text(time);
                                if (time === 0) {
                                    clearTimeout(timer);
                                    parent.location.href = '/system/logout';
                                }
                            }, 1000);
                        }
                        else {
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