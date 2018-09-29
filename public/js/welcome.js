/**
 * Admui-iframe v1.2.0 (http://www.admui.com/)
 * Copyright 2015-2018 Admui Team
 * Licensed under the Admui License 1.0 (http://www.admui.com/about/#license)
 */
(function ($) {
    
			$.ajax({
	                url: SERVER_PATH+"/user/system/getProcess",
	                type: 'POST',
	                data: {},
	                dataType: 'JSON',
	                success: function (data) {
	                    if (data.code==0) {
	                    		$("#todayOrder").text(data.data.todayOrder)
	                    		$("#allOrder").text(data.data.allOrder)
	                    		$("#allGoods").text(data.data.allGoods)
	                    		$("#todayGoods").text(data.data.todayGoods)
	                    		
	                    		$("#allForum").text(data.data.allForum)
	                    		$("#todayForum").text(data.data.todayForum)
	                    		$("#allUser").text(data.data.allUser)
	                    		$("#todayUser").text(data.data.todayUser)
	                    } else {
			                if(data.report){
			                    toastr.error(data.report,"获取数据出错");
			                }else{
			                     toastr.error('出错了，请重试！',"获取数据出错",{"positionClass":"toast-bottom-right"});
			                }
	                    }
	                },
	                error: function () {
	                    toastr.error('服务器异常，请稍后再试！',{"positionClass":"toast-bottom-right"});
	                }
	         });
    
    	
})(jQuery);
