//通用js
//var SERVER_PATH = "http://gateway.fangyuanyouyue.com";
var SERVER_PATH = "http://127.0.0.1:8769";

//判断是否登录
var token = sessionStorage.getItem("token");
if(token&&token.length>0){
	console.log("login already:"+token);
}else{
	//判断是否在框架内 
	if (window.top !== window.self) {
        window.parent.location.href = '../../login.html';
	}else{
		window.location.href="../../login.html";
	}
}
