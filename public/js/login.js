/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function ($) {
    'use strict';

    // 表单验证
    $("#loginForm").validate({
        rules: {
            loginName: {
                required: true
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 30
            },
            validCode: {
                required: true
            }
        },
        messages: {
            loginName: {
                required: '用户名不能为空'
            },
            password: {
                required:'密码不能为空',
                minlength: '密码必须大于6个字符',
                maxlength: '密码必须小于30个字符'
            },
            validCode:{
                required:'验证码不能为空'
            }
        },
        errorElement: "small",
        errorPlacement: function (error, element) {
            var $inputGroup = element.parents('.input-group');
            var $validElement = $inputGroup.length === 0 ? element : $inputGroup;

            // 在error element上添加 `help-block` class
            error.addClass("help-block");

            // 在parent div.form-group 元素上添加 `has-feedback` class
            element.parents(".form-group").addClass("has-feedback");

            error.insertAfter($validElement);
        },
        highlight: function (element) {
            $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
        },
        unhighlight: function (element) {
            $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
        }
    });

    // 验证码刷新
    $('.reload-vify').on('click', function () {
        var $img = $(this).children('img'),
            URL = $img.prop('src');
        $img.prop('src', URL + '?tm=' + Math.random());
    });
})(jQuery);
