//通用js
//var SERVER_PATH = "http://gateway.fangyuanyouyue.com";
var SERVER_PATH = "http://127.0.0.1:8769";
//var SERVER_PATH = "http://zuul.fangyuanyouyue.com";

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
