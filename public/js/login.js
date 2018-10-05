/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function ($) {
    'use strict';
//
//  // 表单验证
//  $("#loginForm").validate({
//      rules: {
//          loginName: {
//              required: true
//          },
//          password: {
//              required: true,
//              minlength: 6,
//              maxlength: 30
//          },
//          validCode: {
//              required: true
//          }
//      },
//      messages: {
//          loginName: {
//              required: '用户名不能为空'
//          },
//          password: {
//              required:'密码不能为空',
//              minlength: '密码必须大于6个字符',
//              maxlength: '密码必须小于30个字符'
//          },
//          validCode:{
//              required:'验证码不能为空'
//          }
//      },
//      errorElement: "small",
//      errorPlacement: function (error, element) {
//          var $inputGroup = element.parents('.input-group');
//          var $validElement = $inputGroup.length === 0 ? element : $inputGroup;
//
//          // 在error element上添加 `help-block` class
//          error.addClass("help-block");
//
//          // 在parent div.form-group 元素上添加 `has-feedback` class
//          element.parents(".form-group").addClass("has-feedback");
//
//          error.insertAfter($validElement);
//      },
//      highlight: function (element) {
//          $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
//      },
//      unhighlight: function (element) {
//          $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
//      }
//  });
    
    $("#loginBtn").click(function(){
    		var loginCode = $("#username").val();
	    		var password = $("#password").val();
	    		$.ajax({
	                url: SERVER_PATH + '/user/system/login',
	                type: 'POST',
	                data: {"loginCode":loginCode,"password":password},
	                dataType: 'JSON',
	                success: function (data) {
	                    if (data.code==0) {
	                    		//保存token
	            				var storage=window.sessionStorage;
	            				storage.setItem("userInfo",JSON.stringify(data.data));
	                    		window.location.href="index.html";
	                    } else {
			                if(data.report){
			                    toastr.error(data.report,"登录失败");
			                }else{
			                     toastr.error('出错了，请重试！',"登录失败",{"positionClass":"toast-bottom-right"});
			                }
	                    }
	                },
	                error: function () {
	                    toastr.error('服务器异常，请稍后再试！',{"positionClass":"toast-bottom-right"});
	                }
	         });
    })
    
    $("#admui-signOut").click(function(){
    		sessionStorage.removeItem("userInfo");
    		window.location.href="login.html";
    });

    // 验证码刷新
    $('.reload-vify').on('click', function () {
        var $img = $(this).children('img'),
            URL = $img.prop('src');
        $img.prop('src', URL + '?tm=' + Math.random());
    });
    
    	
})(jQuery);
