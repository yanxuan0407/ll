document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var email = document.getElementById('email').value;

    if (password !== confirmPassword) {
        alert('密码和确认密码不匹配，请重新输入。');
        return;
    }

    alert('注册成功！用户名: ' + username + '，邮箱: ' + email);
    // 这里可以添加进一步的处理逻辑，如发送数据到服务器
});