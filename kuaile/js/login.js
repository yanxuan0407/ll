// 定义链表
var use_list = ['yx','yxx'];
// 密码
var password_list = ['123','123456']

// 用户按钮
// 获取按钮
var log_btn = document.querySelector('#sign_in');
log_btn.addEventListener('cilck',login);

function login(){
    // 拿到用户名
    var ele =document.querySelector('#username');
    var input_username = ele.value;
    // 拿到密码
    ele = document.querySelector('#password');
    var input_password = ele.value;

    if (user_list.indexOf(input_username) != -1) {
        index =use_list.indexOf(input_username);
        var target_password = password_list[index];
        if (input_password == target_password) {
            alert("登录成功");
        } else {
            alert("登录失败，密码不对");
        }
    }else {
        alert('用户不存在，请注册！')
    }
}