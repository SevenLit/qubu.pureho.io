/**
 * Created by 子杰 on 2016/10/24.
 */
;(function(){
    var obj = {
        submitFlag : false,
        username : '',
        passwd : '',
        captcha: '',
        init : function(){
            if(gppTool.getCookie('login_count') === 'true'){
                $("#captcha_bar").removeClass('hidden');
            }
            obj.bindEvent();
        },
        bindEvent : function(){
            //刷新二维码
            $("#captcha_img").click(function(){
                var that = $(this);
                var random_num = gppTool.randomNum(10);
                that.attr('src','../common/captcha?'+random_num);
            });

            $("#username").bind('input propertychange', function() {
                var username = $("#username").val();
                if($.trim(username) === ''){
                    $("#user_prompt").empty();
                    $("#username").removeClass('bd-red');
                }else if(username.length >= 4 && username.length <= 32){
                    $("#user_prompt").empty();
                    $("#username").removeClass('bd-red');
                }else{
                    $("#username").addClass('bd-red');
                    $("#user_prompt").text('* 用户名长度4-32个字符');
                }
            });

            $("#passwd").bind('input propertychange', function() {
                var passwd = $("#passwd").val();
                if($.trim(passwd) === ''){
                    $("#pw_prompt").empty();
                    $("#passwd").removeClass('bd-red');
                }else if(passwd.length >= 6 && passwd.length <= 32){
                    $("#pw_prompt").empty();
                    $("#passwd").removeClass('bd-red');
                }else{
                    $("#pw_prompt").text('* 密码长度6-32个字符');
                    $("#passwd").addClass('bd-red');
                }
            });

            $("#captcha").bind('input propertychange', function() {
                var captcha = $("#captcha").val();
                if(captcha.length === 4){
                    $("#captcha_prompt").empty();
                    $("#captcha").removeClass('bd-red');
                }
            });

            $("#sub").click(function(){
                if(!obj.checkForm()){
                    return false;
                }
                obj.submitForm();
                return false;
            });

            $("#login_form").submit(function(){
                if(!obj.checkForm()){
                    return false;
                }
               obj.submitForm();
                return false;
            });
        },
        checkForm : function(){
            obj.username = $("#username").val();
            obj.passwd = $("#passwd").val();
            obj.captcha = $("#captcha").val();

            if($.trim(obj.username) === ''){
                $("#user_prompt").text('* 用户名不能为空');
                $("#username").addClass('bd-red');
                $("#username").focus();
                return false;
            }else if(obj.username.length < 4 || obj.username.length > 32){
                $("#user_prompt").text('* 用户名不正确');
                $("#username").addClass('bd-red');
                $("#username").focus();
                return false;
            }else if($.trim(obj.passwd) === ''){
                $("#pw_prompt").text('* 密码不能为空');
                $("#passwd").addClass('bd-red');
                $("#passwd").focus();
                return false;
            }else if(obj.passwd.length < 6 || obj.passwd.length > 32){
                $("#pw_prompt").text('* 密码不正确');
                $("#passwd").addClass('bd-red');
                $("#passwd").focus();
                return false;
            }else if(!$("#captcha_bar").hasClass("hidden") && obj.captcha.length !== 4){
                $("#captcha_prompt").text('* 验证码不正确');
                $("#captcha").addClass('bd-red');
                $("#captcha").focus();
                return false;
            }
            return true;
        },
        submitForm : function(){
            if (!obj.checkForm()){
                return false;
            }

            if (obj.submitFlag === true) {
                return false;
            }

            obj.submitFlag = true;

            $.ajax({
                url: "/member/login",
                type: "POST",
                dataType: 'json',
                async: true,
                data: {
                    user_name: obj.username,
                    user_pw: $.md5(obj.passwd),
                    captcha:obj.captcha
                },
                success: function (data) {
                    obj.submitFlag = false;
                    if(data.login_count >= 3){
                        gppTool.setCookie('login_count','true','86400');
                        $("#captcha_bar").removeClass('hidden');
                    }

                    if(data.code === -1){
                        $("#captcha_prompt").text('* 验证码不正确');
                        $("#captcha").addClass('bd-red');
                        $("#captcha").focus();
                        return false;
                    }

                    if(data.code === 0){
                        alert(data.msg);
                        return false;
                    }
                    window.location = '/';
                    return false;
                }
            });
        }
    };
    window.pageScript = new obj.init();
})();