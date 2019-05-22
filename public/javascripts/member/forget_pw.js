;(function(){
    var obj ={
        submitFlag : false,
        email : '',
        captcha : '',
        d_email : '',
        email_captcha : '',
        new_pw : '',
        repeat_new_pw : '',
        init : function(){
            obj.bindEvent();
        },
        bindEvent : function(){
            //刷新二维码
            $("#captcha_img").click(function(){
                var that = $(this);
                var random_num = gppTool.randomNum(10);
                that.attr('src','../common/captcha?'+random_num);
            });

            $('#email').bind('input propertychange', function() {
                var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                var email = $(this).val();
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
			
            $("#captcha").bind('input propertychange', function() {
                var captcha = $(this).val();
                if(captcha.length === 4){
                    $("#captcha_prompt").empty();
                    $("#captcha").removeClass('bd-red');
                }
            });

            $("#email_captcha").bind('input propertychange', function(){
                var email_captcha = $(this).val();
                if(email_captcha.length === 6){
                    $("#email_captcha_prompt").empty();
                    $("#email_captcha").removeClass('bd-red');
                }
            });

            $("#new_pw").bind('input propertychange',function(){
                var new_pw = $(this).val();
                if($.trim(new_pw) === ''){
                    $("#pw_prompt").empty();
                    $("#new_pw").removeClass('bd-red');
                }else if(new_pw.length >= 6 && new_pw.length <= 32){
                    $("#pw_prompt").empty();
                    $("#new_pw").removeClass('bd-red');
                }else{
                    $("#pw_prompt").text('* 密码长度6-32个字符');
                }
            });

            //确认密码
            $('#repeat_new_pw').bind('input propertychange', function() {
                var passwd = $("#new_pw").val();
                var repeat_passwd = $(this).val();

                if($.trim(repeat_passwd) === ''){
                    $("#repeat_pw_prompt").empty();
                    $("#repeat_new_pw").removeClass('bd-red');
                }else if(passwd.length !== repeat_passwd.length || passwd !== repeat_passwd){
                    $("#repeat_pw_prompt").text('* 两次输入的密码不一致');
                }else{
                    $("#repeat_pw_prompt").empty();
                    $("#repeat_new_pw").removeClass('bd-red');
                }
            });
			
			//确认邮箱地址是否存在
            $("#confirmEmail_btn").click(function(){
				if(!obj.checkForm()){
					return false;
				}
                obj.selectEmailForm();
				return false;
            });
			
			//发送邮件
			$("#sendEmail_btn").click(function(){
                var d_email = $("#d_email").val();
                if($.trim(d_email) === ''){
                    alert('网络异常，请刷新页面重试');
                    return false;
                }
                $(this).attr('disabled', 'true');
                obj.sendEmailFrom();
                return false;
            });
			
			//获取验证码后下一步
			$("#sendEmail_next").click(function(){
                if(!obj.sendEmailCheckForm()){
                    return false;
                }
                obj.getCaptchaForm();
                return false;
			});

            //修改密码
            $("#sub").click(function(){
                if(!obj.checkPWform()){
                    return false;
                }
                obj.submitForm();
                return false;
            });
        },
        //查询邮件是否存在
        selectEmailForm : function(){
            var getDataUrl = '/member/selectEmail';

            if(!obj.checkForm()){
                return false;
            }
            if (obj.submitFlag === true) {
                return false;
            }

            obj.submitFlag = true;

            $.get(getDataUrl,{email:obj.email,captcha:obj.captcha},function(data){
                if(data.code === -1){
                    $("#captcha_prompt").text('* '+data.msg);
                    $("#captcha").addClass('bd-red');
                    $("#captcha").focus();
                    return false;
                }else if(data.code === 0){
                    $("#email_prompt").text('* '+data.msg);
                    $("#email").addClass('bd-red');
                    $("#email").focus();
                    return false;
                }else if(data.code === 200){
                    $("#d_email").val(data.email);
                    $("#confirmEmail_form").addClass("hidden");
                    $("#sendEmail_form").removeClass("hidden");
                    return false;
                }
				return false;
            }).complete(function() {
                obj.submitFlag = false;
            });
        },
        //发送邮件
        sendEmailFrom : function(){
            obj.d_email = $("#d_email").val();
            var sendUrl = '/member/sendEmail';

            if (obj.submitFlag === true) {
                return false;
            }

            obj.submitFlag = true;

            $.get(sendUrl,{email:obj.d_email},function(data){
                if(data.code === 200){
                    var countdown = 119;
                    $("#sendEmail_btn").text('(' + countdown + ')' + '重发');
                    timer = setInterval(function () {
                        if (countdown > 0) {
                            countdown--;
                            $("#sendEmail_btn").text('(' + countdown + ')' + '重发');
                        } else {
                            clearTimeout(timer);
                            $("#sendEmail_btn").removeAttr("disabled");
                            $("#sendEmail_btn").text('获取验证码');
                            $("#email_captcha_prompt").empty();
                        }
                    }, 1000);
                    $("#email_captcha_prompt").text(data.msg);
                }else{
                    alert('发送邮件失败');
                    return false;
                }
                return false;
            }).error(function(){
                $("#sendEmail_btn").removeAttr("disabled");
            }).complete(function() {
                obj.submitFlag = false;
            });
        },
        //发送邮箱验证码到后台校验
        getCaptchaForm : function(){
            var sendUrl = '/member/checkCaptcha';

            if(!obj.sendEmailCheckForm()){
                return false;
            }

            if (obj.submitFlag === true) {
                return false;
            }

            obj.submitFlag = true;

            $.get(sendUrl,{email:obj.d_email,email_captcha:obj.email_captcha},function(data){
                if(data.code === -1){
                    $("#email_captcha_prompt").text('* '+data.msg);
                    $("#email_captcha").addClass('bd-red');
                    $("#email_captcha").focus();
                    return false;
                }else if(data.code === 200){
                   $("#sendEmail_form").addClass('hidden');
                   $("#updatePW_form").removeClass('hidden');
                    return false;
                }
                return false;
            }).complete(function() {
                obj.submitFlag = false;
            });
        },
        //修改密码
        submitForm : function(){
            var sendUrl = '/member/forget_pw';

            if(!obj.checkPWform()){
                return false;
            }

            if (obj.submitFlag === true) {
                return false;
            }

            obj.submitFlag = true;

            $.post(sendUrl,{user_pw:$.md5(obj.repeat_new_pw),user_email:obj.email},function(data){
                 if(data.code === 200){
                    alert('修改密码成功！');
                    window.location.href = '/member/login';
                    return false;
                }
                return false;
            }).complete(function() {
                obj.submitFlag = false;
            });
        },
        //校验查询邮件
        checkForm : function(){
            var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            obj.email = $("#email").val();
            obj.captcha = $("#captcha").val();

            if(!emailReg.test(obj.email)){
                $("#email_prompt").text('* 请输入正确的邮箱');
                $("#email").addClass('bd-red');
                $("#email").focus();
                return false;
            }else if($.trim(obj.captcha) === ''){
                $("#captcha_prompt").text('* 请输入验证码');
                $("#captcha").addClass('bd-red');
                $("#captcha").focus();
                return false;
            }else if(obj.captcha.length !== 4){
                $("#captcha_prompt").text('* 验证码不正确');
                $("#captcha").addClass('bd-red');
                $("#captcha").focus();
            }
            return true;
        },
        //校验发送邮件
        sendEmailCheckForm : function(){
            obj.d_email = $("#d_email").val();
            obj.email_captcha = $("#email_captcha").val();

            if($.trim(obj.d_email) === ''){
                alert('网络异常，请刷新页面重试');
                return false;
            }else if($.trim(obj.email_captcha) === ''){
                $("#email_captcha_prompt").text('* 请输入邮箱验证');
                $("#email_captcha").addClass('bd-red');
                $("#email_captcha").focus();
                return false;
            }else if(obj.email_captcha.length !== 6){
                $("#email_captcha_prompt").text('* 邮箱验证不正确');
                $("#email_captcha").addClass('bd-red');
                $("#email_captcha").focus();
                return false;
            }
            return true;
        },
        //校验密码
        checkPWform : function(){
            obj.new_pw = $("#new_pw").val();
            obj.repeat_new_pw = $("#repeat_new_pw").val();

            if($.trim(obj.new_pw) === ''){
                $("#pw_prompt").text('* 请输入新密码');
                $("#new_pw").addClass('bd-red');
                $("#new_pw").focus();
                return false;
            }else if(obj.new_pw.length < 6 || obj.new_pw.length > 32){
                $("#pw_prompt").text('* 密码长度6-32个字符');
                $("#new_pw").addClass('bd-red');
                $("#new_pw").focus();
                return false;
            }else if(obj.new_pw !== obj.repeat_new_pw){
                $("#repeat_pw_prompt").text('两次输入的密码不一致');
                $("#repeat_new_pw").addClass('bd-red');
                $("#repeat_new_pw").focus();
                return false;
            }
            return true;
        }
    };
    window.pageScript = new obj.init();
})();