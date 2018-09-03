/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function (window, document, $) {
    'use strict';

    $.components.register("validate", {
        mode: "init",
        defaults: {},
        init: function (context, iframe) {
            var iframe$ = iframe ? iframe.$ : $;

            if (!iframe$.fn.validate) {
                return;
            }

            // 固定电话验证
            iframe$.validator.addMethod("mobileZH", function (phone_number, element) {
                phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
                return this.optional(element) || phone_number.length > 6 &&
                    phone_number.match(/^0\d{2,3}-?\d{7,8}$/);
            }, "请输入有效的电话号码");

            // 手机号验证
            iframe$.validator.addMethod("phoneZH", function (phone_number, element) {
                phone_number = phone_number.replace(/\s+/g, "");
                return this.optional(element) || phone_number.length > 9 &&
                    phone_number.match(/^1[3|4|5|8][0-9]\d{4,8}$/);
            }, "请输入有效的手机号码");

            iframe$.validator.setDefaults({
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
                unhighlight: function(element, errorClass, validClass) {
                    var $valid = $(element).parents('.form-group');

                    if (!validClass) {
                        $valid.removeClass('has-error has-success');
                    } else {
                        $valid.addClass('has-success').removeClass('has-error');
                    }
                }
            });
        }
    });
})(window, document, jQuery);