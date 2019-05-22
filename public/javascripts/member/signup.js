;(function(){
	var obj = {
		submitFlag : false,
		username : '',
		passwd : '',
		verify_passwd : '',
		nick_name : '',
		sex : '',
		phone : '',
		captcha : '',
		email : '',
		address : '',
		init: function () {
			obj.bindEvent();
		},
		bindEvent: function(){
			//选择性别
			$("input[name='sex']").click(function(){
				var val = $(this).val();
				$("#sex_val").val(val);
			});
			
			//刷新二维码
			$("#captcha_img").click(function(){
				var that = $(this);
				var random_num = gppTool.randomNum(10);
				that.attr('src','../common/captcha?'+random_num);
			});
			
			//表单提示
			$('#username').bind('input propertychange', function() {
				var username = $("#username").val();
				if($.trim(username) === ''){
					$("#name_prompt").empty();
				}else if(username.length >= 4 && username.length <= 32){
					$("#name_prompt").empty();
				}else{
					$("#name_prompt").text('* 用户名长度4-32个字符');
				}
			});

			//密码
			$('#passwd').bind('input propertychange', function() {
				var passwd = $("#passwd").val();
				if($.trim(passwd) === ''){
					$("#passwd_prompt").empty();
				}else if(passwd.length >= 6 && passwd.length <= 32){
					$("#passwd_prompt").empty();
				}else{
					$("#passwd_prompt").text('* 密码长度6-32个字符');
				}
			});

            //确认密码
			$('#repeat_passwd').bind('input propertychange', function() {
				var passwd = $("#passwd").val();
				var repeat_passwd = $("#repeat_passwd").val();
				
				if($.trim(repeat_passwd) === ''){
					$("#repeatpw_prompt").empty();
				}else if(passwd.length !== repeat_passwd.length || passwd !== repeat_passwd){
					$("#repeatpw_prompt").text('* 两次输入的密码不一致');
				}else{
					$("#repeatpw_prompt").empty();
				}
			});

            //手机号码
			$('#phone').bind('input propertychange', function() {
				var phone = $("#phone").val();

				if($.trim(phone) === ''){
					$("#phone_prompt").empty();
				}if(gppTool.isPhoneNum(phone) === 0 || gppTool.isPhoneNum(phone) === 4 || phone.length !== 11){
					$("#phone_prompt").text('* 请输入正确的手机号码');
				}else{
					$("#phone_prompt").empty();
				}
			});

            //验证码
			$('#captcha').bind('input propertychange', function() {
				var captcha = $("#captcha").val();
				if($.trim(captcha) === '' || captcha.length === 4){
					$("#captcha_prompt").empty();
				}
			});

            //邮箱
			$('#email').bind('input propertychange', function() {
				var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				var email = $("#email").val();
                if($.trim(email) === '') {
                    $("#email_prompt").empty();
                    $("#email").removeClass('bd-red');
                }else if(emailReg.test(email)){
                    $("#email_prompt").empty();
                    $("#email").removeClass('bd-red');
                }else{
                    $("#email_prompt").text('* 请输入正确的邮箱');
                    $("#email").addClass('bd-red');
                }
			});

			//提交表单
			$("#sub").click(function(){
				if(!obj.checkForm()){
					return false;
				}
				obj.submitForm();
				return false;
			});

			$("#signup_form").submit(function(){
				if(!obj.checkForm()){
					return false;
				}
				obj.submitForm();
				return false;
			});
		},
		checkForm:function(){
			var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

			obj.username = $("#username").val();
			obj.passwd = $("#passwd").val();
			obj.repeat_passwd = $("#repeat_passwd").val();
			obj.nick_name = $("#nick_name").val();
			obj.sex = $("#sex_val").val();
			obj.phone = $("#phone").val();
			obj.captcha = $("#captcha").val();
			obj.email = $("#email").val();
			obj.address = $("#address").val();

			if($.trim(obj.username) === ''){
				$("#name_prompt").text('* 请输入用户名');
				$("#username").focus();
				return false;
			}else if(obj.username.length < 4 || obj.username.length > 32){
				$("#name_prompt").text('* 用户名长度4-32个字符');
				$("#username").focus();
				return false;
			}else if($.trim(obj.passwd) === ''){
				$("#passwd_prompt").text('* 请输入密码');
				$("#passwd").focus();
				return false;
			}else if(obj.passwd.length < 6 || obj.passwd.length > 32){
				$("#passwd_prompt").text('* 密码长度6-32个字符');
				$("#passwd").focus();
				return false;
			}else if($.trim(obj.repeat_passwd) === ''){
				$("#repeatpw_prompt").text('* 请再次输入密码');
				$("#repeat_passwd").focus();
				return false;
			}else if(obj.passwd !== obj.repeat_passwd){
				$("#passwd_prompt").text('* 两次输入的密码不一致');
				$("#repeatpw_prompt").text('* 两次输入的密码不一致');
				$("#repeat_passwd").focus();
				return false;
			}else if(gppTool.isPhoneNum(obj.phone) === 0 ||gppTool.isPhoneNum(obj.phone) === 4){
				$("#phone_prompt").text('* 请输入正确的手机号码');
				$("#phone").focus();
				return false;
			}else if($.trim(obj.captcha) === '' || obj.captcha.length !== 4 ){
				$("#captcha_prompt").text('* 验证码不正确');
				$("#captcha").focus();
				return false;
			}else if($.trim(obj.email) === ''){
				$("#email_prompt").text('* 请输入邮箱');
				$("#email").focus();
				return false;
			}else if(!emailReg.test(obj.email)){
				$("#email_prompt").text('* 请输入正确的邮箱');
				$("#email").focus();
				return false;
			}
			return true;
		},
		submitForm:function(){
			if (!obj.checkForm()){
				return false;
			}

			if (obj.submitFlag === true) {
				return false;
			}

			obj.submitFlag = true;

			$.ajax({
				url: "/member/signup",
				type:"POST",
				dataType: 'json',
				async:true,
				data:{
					user_name : obj.username,
					user_pw : $.md5(obj.passwd),
					nick_name : obj.nick_name,
					user_phone : obj.phone,
					user_sex : obj.sex,
					user_email : obj.email,
					user_address : obj.address,
                    captcha : obj.captcha
				},
				success:function(data){
					obj.submitFlag = false;
					if(data.code === -1){
                        $("#captcha_prompt").text('* 验证码不正确');
                        $("#captcha").focus();
                        return false;
                    }else if(data.code === 0){
						alert(data.msg);
						return false;
					}else if(data.code === 2){
						$("#name_prompt").text('* 用户名已注册');
						$("#username").focus();
						return false;
					}else if(data.code === 3){
						$("#phone_prompt").text('* 手机号码已存在');
						$("#phone").focus();
						return false;
					}else if(data.code === 4){
						$("#email_prompt").text('* 邮箱已存在');
						$("#email").focus();
						return false;
					}
					alert(data.msg);
					window.location = "/member/login";
				}

			});
		}
	};
	window.pageScript = new obj.init();
})();


