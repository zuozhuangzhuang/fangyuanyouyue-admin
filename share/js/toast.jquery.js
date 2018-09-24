/*
	获取URL信息
*/
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
};
var Request = new Object();
Request = GetRequest();
/**
 * 模仿android里面的Toast效果，主要是用于在不打断程序正常执行的情况下显示提示数据
 *  new Toast({context:$('body'),message:'Toast效果显示'}).show();
 */
var Toast = function(config){
	this.context = config.context==null?$('body'):config.context;//上下文
	this.message = config.message;//显示内容
	this.time = config.time==null?4000:config.time;//持续时间
	this.left = config.left;//距容器左边的距离
	this.top = config.top;//距容器上方的距离
	this.init();
}
var msgEntity;
Toast.prototype = {
	//初始化显示的位置内容等
	init : function(){
		$("#toastMessage").remove();
		//设置消息体
		var msgDIV = new Array();
		msgDIV.push('<div id="toastMessage">');
		msgDIV.push('<span>'+this.message+'</span>');
		msgDIV.push('</div>');
		msgEntity = $(msgDIV.join('')).appendTo(this.context);
		//设置消息样式
		var left = this.left == null ? this.context.width()/2-msgEntity.find('span').width()/2 : this.left;
		var top = this.top == null ? $(window).height()/2-msgEntity.find('span').height()/2 : this.top;//'50px' : this.top;
		msgEntity.css({position:'fixed',bottom:top,'z-index':'999',left:left,'background-color':'#555',color:'#fff','font-size':'14px',padding:'20px','border-radius':'2px',margin:'-20px','border-radius':'5px'});
		//msgEntity.hide();
	},
	//显示动画
	show :function(){
		var left = this.left == null ? this.context.width()/2-msgEntity.find('span').width()/2 : this.left;
		msgEntity.css({left:left});
		msgEntity.fadeIn(this.time/2);
		msgEntity.fadeOut(this.time/2);
	}
		
}