//通用js
//var SERVER_PATH = "http://gateway.fangyuanyouyue.com";
// var SERVER_PATH = "http://192.168.1.66:8769";
// var SERVER_PATH = "http://zuul.fangyuanyouyue.com";
var SERVER_PATH = "http://gateway.fangyuanyouyue.com";

//判断是否登录
var userInfo = sessionStorage.getItem("userInfo");
if(userInfo&&userInfo.length>0){
	var obj = JSON.parse(userInfo);
	console.log("login already:"+obj.userCode);
}else{
	if(window.location.href.indexOf("login.html")<=0){
		
		//判断是否在框架内 
		if (window.top !== window.self) {
			window.parent.location.href = '../../login.html';
		}else{
			window.location.href="../../login.html";
		}
	}
	
}
