//将13位long类型转为时间
function setTime(value) {
	if (value == null || value == 0) {
		return ''
	} else { 
		//时区的转换
		var d = new Date();
		var localTime = d.getTime(); 
		var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数 
		return Ext.util.Format.date(new Date(parseInt(value)-localOffset), 'Y-m-d H:i:s')
	}
}

// 获取浏览器参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

//设置性别
function setGender(value){
	if(value=='1'){
    		return "<span class='label label-warning'>男</span>"
	}else if(value=='0'){
		
    		return "<span class='label label-info'>女</span>"
	}else{
		return "<span class='label label-default'>未知</span>";
	}
}

//设置是否
function setYesNo(value){
    if(value=='0'){
        return "<font  >是</font>";
    }else if(value=='1'){
        return "<font  >否</font>";
    }else{
        return "<font >未知</font>";
    }
}


//时间格式转换
function format(d,format){
	var o = {
	"M+" : d.getMonth()+1, //month
	"d+" : d.getDate(),    //day
	"h+" : d.getHours(),   //hour
	"m+" : d.getMinutes(), //minute
	"s+" : d.getSeconds(), //second
	"q+" : Math.floor((d.getMonth()+3)/3),  //quarter
	"S" : d.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	(d.getFullYear()+"").substr(4 - RegExp.$1.length));
	
	for(var k in o)if(new RegExp("("+ k +")").test(format))
	format = format.replace(RegExp.$1,
	RegExp.$1.length==1 ? o[k] :
	("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}


//返回时间
function formatLongDate(long){
	var d = new Date();
	var localTime = d.getTime(); 
	var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数 
	var date = new Date(long-localOffset);
	return format(date,'yyyy-MM-dd hh:mm:ss');
}

function setImg(data){
	if (data == null || data.length == 0) {
		return ''
	} else { 
		return "<img src="+data+" onclick='showPic(\""+data+"\")' height=30 width=30 class='img-circle' />";
	}
}


function setImg2(data){
	if (data == null || data.length == 0) {
		return ''
	} else { 
		return "<img src="+data+" onclick='showPic(\""+data+"\")' height=30 width=30  />";
	}
}


function showBigPic(name) {
	var com = document.getElementById(name);
	window.open(com.src, "image", 'fullscreen=1,top=0,left=0,height=600,width=1000, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,titlebar=no');
}
function showBigPic2(name) {
    window.open(name, "image", 'fullscreen=1,top=0,left=0,height=600,width=1000, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,titlebar=no');
}

function showPic(name) {
    window.open(name, "image", 'fullscreen=1,top=0,left=0,height=600,width=1000, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,titlebar=no');
}




/**
* 日期处理工具类
*/

var DateUtil = function(){

    /**
     * 判断闰年
     * @param date Date日期对象
     * @return boolean true 或false
     */
    this.isLeapYear = function(date){
        return (0==date.getYear()%4&&((date.getYear()%100!=0)||(date.getYear()%400==0))); 
    }
    
    /**
     * 日期对象转换为指定格式的字符串
     * @param f 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
     * @param date Date日期对象, 如果缺省，则为当前时间
     *
     * YYYY/yyyy/YY/yy 表示年份  
     * MM/M 月份  
     * W/w 星期  
     * dd/DD/d/D 日期  
     * hh/HH/h/H 时间  
     * mm/m 分钟  
     * ss/SS/s/S 秒  
     * @return string 指定格式的时间字符串
     */
    this.dateToStr = function(formatStr, date){
        formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
        date = arguments[1] || new Date();
        var str = formatStr;   
        var Week = ['日','一','二','三','四','五','六'];  
        str=str.replace(/yyyy|YYYY/,date.getFullYear());   
        str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));   
        str=str.replace(/MM/,date.getMonth()>9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));   
        str=str.replace(/M/g,date.getMonth());   
        str=str.replace(/w|W/g,Week[date.getDay()]);   
      
        str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());   
        str=str.replace(/d|D/g,date.getDate());   
      
        str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());   
        str=str.replace(/h|H/g,date.getHours());   
        str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());   
        str=str.replace(/m/g,date.getMinutes());   
      
        str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());   
        str=str.replace(/s|S/g,date.getSeconds());   
      
        return str;   
    }

    
    /**
    * 日期计算  
    * @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒  
    * @param num int
    * @param date Date 日期对象
    * @return Date 返回日期对象
    */
    this.dateAdd = function(strInterval, num, date){
        date =  arguments[2] || new Date();
        switch (strInterval) { 
            case 's' :return new Date(date.getTime() + (1000 * num));  
            case 'n' :return new Date(date.getTime() + (60000 * num));  
            case 'h' :return new Date(date.getTime() + (3600000 * num));  
            case 'd' :return new Date(date.getTime() + (86400000 * num));  
            case 'w' :return new Date(date.getTime() + ((86400000 * 7) * num));  
            case 'm' :return new Date(date.getFullYear(), (date.getMonth()) + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());  
            case 'y' :return new Date((date.getFullYear() + num), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());  
        }  
    }  
    
    /**
    * 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
    * @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒  
    * @param dtStart Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
    * @param dtEnd Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒 
    */
    this.dateDiff = function(strInterval, dtStart, dtEnd) {   
        switch (strInterval) {   
            case 's' :return parseInt((dtEnd - dtStart) / 1000);  
            case 'n' :return parseInt((dtEnd - dtStart) / 60000);  
            case 'h' :return parseInt((dtEnd - dtStart) / 3600000);  
            case 'd' :return parseInt((dtEnd - dtStart) / 86400000);  
            case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));  
            case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);  
            case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();  
        }  
    }

    /**
    * 字符串转换为日期对象
    * @param date Date 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
    */
    this.strToDate = function(dateStr){
        var data = dateStr;  
        var reCat = /(\d{1,4})/gm;   
        var t = data.match(reCat);
        t[1] = t[1] - 1;
        eval('var d = new Date('+t.join(',')+');');
        return d;
    }

    /**
    * 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
    * 
    */
    this.strFormatToDate = function(formatStr, dateStr){
        var year = 0;
        var start = -1;
        var len = dateStr.length;
        if((start = formatStr.indexOf('yyyy')) > -1 && start < len){
            year = dateStr.substr(start, 4);
        }
        var month = 0;
        if((start = formatStr.indexOf('MM')) > -1  && start < len){
            month = parseInt(dateStr.substr(start, 2)) - 1;
        }
        var day = 0;
        if((start = formatStr.indexOf('dd')) > -1 && start < len){
            day = parseInt(dateStr.substr(start, 2));
        }
        var hour = 0;
        if( ((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len){
            hour = parseInt(dateStr.substr(start, 2));
        }
        var minute = 0;
        if((start = formatStr.indexOf('mm')) > -1  && start < len){
            minute = dateStr.substr(start, 2);
        }
        var second = 0;
        if((start = formatStr.indexOf('ss')) > -1  && start < len){
            second = dateStr.substr(start, 2);
        }
        return new Date(year, month, day, hour, minute, second);
    }


    /**
    * 日期对象转换为毫秒数
    */
    this.dateToLong = function(date){
        return date.getTime();
    }

    /**
    * 毫秒转换为日期对象
    * @param dateVal number 日期的毫秒数 
    */
    this.longToDate = function(dateVal){
        return new Date(dateVal);
    }

    /**
    * 判断字符串是否为日期格式
    * @param str string 字符串
    * @param formatStr string 日期格式， 如下 yyyy-MM-dd
    */
    this.isDate = function(str, formatStr){
        if (formatStr == null){
            formatStr = "yyyyMMdd";    
        }
        var yIndex = formatStr.indexOf("yyyy");     
        if(yIndex==-1){
            return false;
        }
        var year = str.substring(yIndex,yIndex+4);     
        var mIndex = formatStr.indexOf("MM");     
        if(mIndex==-1){
            return false;
        }
        var month = str.substring(mIndex,mIndex+2);     
        var dIndex = formatStr.indexOf("dd");     
        if(dIndex==-1){
            return false;
        }
        var day = str.substring(dIndex,dIndex+2);     
        if(!isNumber(year)||year>"2100" || year< "1900"){
            return false;
        }
        if(!isNumber(month)||month>"12" || month< "01"){
            return false;
        }
        if(day>getMaxDay(year,month) || day< "01"){
            return false;
        }
        return true;   
    }
    
    this.getMaxDay = function(year,month) {     
        if(month==4||month==6||month==9||month==11)     
            return "30";     
        if(month==2)     
            if(year%4==0&&year%100!=0 || year%400==0)     
                return "29";     
            else     
                return "28";     
        return "31";     
    }     
    /**
    *    变量是否为数字
    */
    this.isNumber = function(str)
    {
        var regExp = /^\d+$/g;
        return regExp.test(str);
    }
    
    /**
    * 把日期分割成数组 [年、月、日、时、分、秒]
    */
    this.toArray = function(myDate)  
    {   
        myDate = arguments[0] || new Date();
        var myArray = Array();  
        myArray[0] = myDate.getFullYear();  
        myArray[1] = myDate.getMonth();  
        myArray[2] = myDate.getDate();  
        myArray[3] = myDate.getHours();  
        myArray[4] = myDate.getMinutes();  
        myArray[5] = myDate.getSeconds();  
        return myArray;  
    }  
    
    /**
    * 取得日期数据信息  
    * 参数 interval 表示数据类型  
    * y 年 M月 d日 w星期 ww周 h时 n分 s秒  
    */
    this.datePart = function(interval, myDate)  
    {   
        myDate = arguments[1] || new Date();
        var partStr='';  
        var Week = ['日','一','二','三','四','五','六'];  
        switch (interval)  
        {   
            case 'y' :partStr = myDate.getFullYear();break;  
            case 'M' :partStr = myDate.getMonth()+1;break;  
            case 'd' :partStr = myDate.getDate();break;  
            case 'w' :partStr = Week[myDate.getDay()];break;  
            case 'ww' :partStr = myDate.WeekNumOfYear();break;  
            case 'h' :partStr = myDate.getHours();break;  
            case 'm' :partStr = myDate.getMinutes();break;  
            case 's' :partStr = myDate.getSeconds();break;  
        }  
        return partStr;  
    }

	this.getDateDiff = function(dateTimeStamp){
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var now = new Date().getTime();
		var diffValue = now - dateTimeStamp;
		if(diffValue < 0){return;}
		var monthC =diffValue/month;
		var weekC =diffValue/(7*day);
		var dayC =diffValue/day;
		var hourC =diffValue/hour;
		var minC =diffValue/minute;
		if(monthC>=1){
			result="" + parseInt(monthC) + "月前";
		}
		else if(weekC>=1){
			result="" + parseInt(weekC) + "周前";
		}
		else if(dayC>=1){
			result=""+ parseInt(dayC) +"天前";
		}
		else if(hourC>=1){
			result=""+ parseInt(hourC) +"小时前";
		}
		else if(minC>=1){
			result=""+ parseInt(minC) +"分钟前";
		}else{
			result="刚刚";
		}
		return result;
	}
	
    
    /**
    * 取得当前日期所在月的最大天数  
    */
    this.maxDayOfDate = function(date)  
    {   
        date = arguments[0] || new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() + 1);
        var time = date.getTime() - 24 * 60 * 60 * 1000;
        var newDate = new Date(time);
        return newDate.getDate();
    }
    
    return this;
}();




