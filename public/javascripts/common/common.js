// JavaScript Document
var gppTool = {
	/*
	 *显示默认图片
	 *type：null;
	 */
	defaultImg:function(type){
		var img=event.srcElement;
		switch(type){
			case 0:
				img.src= "../images/logo.png";
				break;
			case 1:
				img.src= "../images/head.png";
				break;
			default:
				break;
		}
		img.onerror=null; //控制不要一直跳动
	},

	//获取url静态参数
    getUrlParam: function (name) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if (r !== null) return unescape(r[2]);
        return null;
    },

	//显示隐藏
	gopage:function(hidepage,showpage){
		$(hidepage).hide();
		$(showpage).show();
	},

	//获取当前时间
	getTime: function(type){
		var d = new Date();
		var y = d.getFullYear();
		var month = d.getMonth()+1;
		var date = d.getDate();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var m_s = d.getMilliseconds();
		var nowTime = '';

		if(month < 10){
			month = '0'+month;
		}
		if(date < 10){
			date = '0'+date;
		}
		if(h < 10){
			h = '0'+h;
		}
		if(m < 10){
			m = '0'+m;
		}
		if(s < 10){
			s = '0'+s;
		}
		if(type === 1){
            nowTime = y.toString()+month.toString()+date.toString();
		}else if(type === 2){
            nowTime = y.toString()+'-'+month.toString()+'-'+date.toString()+' '+h.toString()+':'+m.toString()+':'+s.toString();
		}else{
            nowTime = y.toString()+month.toString()+date.toString()+h.toString()+m.toString()+s.toString()+m_s.toString();
		}
		return nowTime;
	},

	//判断网络状态
	isOnline:function(){
		return navigator.onLine;
	},

	//判断是否微信浏览器
	isWeiXin:function(){
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) === 'micromessenger'){
			return true;
		}else{
			return false;
		}
	},

	//验证手机号码
	isPhoneNum: function (num) {
		var flag = 0;
		var phoneRe = /^1\d{10}$/;
		/*电信*/
		var dx = [133, 153, 177, 180, 181, 189, 170];
		/*联通*/
		var lt = [130, 131, 132, 145, 155, 156, 185, 186];
		/*移动*/
		var yd = [134, 135, 136, 137, 138, 139, 147, 150, 151, 152, 157, 158, 159, 178, 182, 183, 184, 187, 188];

		function inArray(val, arr) {
			for (var i in arr) {
				if (val === arr[i]){
					return true;
                }
			}
			return false;
        }

        if (phoneRe.test(num)) {
			var temp = parseInt(num.slice(0, 3));
			if (inArray(temp, yd)) return 1;
			if (inArray(temp, lt)) return 2;
			if (inArray(temp, dx)) return 3;
			return 4;
		}
		return flag;
	},

	//获取cookie
	getCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {          //判断一下字符串有没有前导空格
                c = c.substring(1, c.length);      //有的话，从第二位开始取
            }
            if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name
                return unescape(c.substring(nameEQ.length, c.length));    //解码并截取我们要值
            }
        }
    },

	//设置cookie
    setCookie: function (name, value, seconds) {
        seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个跟php不一样。
        var expires = "";
        if (seconds != 0) {      //设置cookie生存时间
            var date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + escape(value) + expires + "; path=/";   //转码并赋值
    },

	//清除cookie
    clearCookie: function (name) {
        cnTool.setCookie(name, "", -1);
    },

	//随机数
	randomNum:function(n){
		var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		var res = "";
		for(var i = 0; i < n ; i ++) {
			var id = Math.ceil(Math.random()*35);
			res += chars[id];
		}
		return res;
	},

	//base64加密
	base64Encode: function(str){
		var c1, c2, c3;
		var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var i = 0, len= str.length, string = '';
		while (i < len){
			c1 = str.charCodeAt(i++) & 0xff;
			if (i === len){
				string += base64EncodeChars.charAt(c1 >> 2);
				string += base64EncodeChars.charAt((c1 & 0x3) << 4);
				string += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i === len){
				string += base64EncodeChars.charAt(c1 >> 2);
				string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				string += base64EncodeChars.charAt((c2 & 0xF) << 2);
				string += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			string += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return string;
	}
};

$(function(){
	//ajax全局配置
	$.ajaxSetup({
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("input:button").attr("disabled",false);
			if(textStatus === 'timeout') {
				alert('请求超时,请检查网络是否畅通');
				return false;
			} else if(textStatus === 'error'){
				alert('请求超时,请检查网络是否畅通');
				return false;
			} else if(textStatus === 'notmodified'){
				alert('重复请求');
				return false;
			} else {
				alert('数据解析异常，请刷新重试');
				return false;
			}
		}
	});
});