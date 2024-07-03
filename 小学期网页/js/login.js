// 定义用户和密码对象
const users = {
    'yx': '123',
    'yxx': '123456'
};

// 登录表单提交事件处理
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('loginUsername').value;
    const passwordInput = document.getElementById('loginPassword').value;

    if (users.hasOwnProperty(usernameInput)) {
        const targetPassword = users[usernameInput];
        if (passwordInput === targetPassword) {
            alert("登录成功");
            // 将用户名存储到 localStorage
            localStorage.setItem('username', usernameInput);
            // 登录成功后跳转到欢迎页面
            window.location.href = './index.html';
        } else {
            alert("登录失败，密码不对");
        }
    } else {
        alert('用户不存在，请注册！');
    }
});

// 注册表单提交事件处理
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value;

    if (password !== confirmPassword) {
        alert('密码和确认密码不匹配，请重新输入。');
        return;
    }

    // 注册成功逻辑
    users[username] = password;
    alert('注册成功！用户名: ' + username + '，邮箱: ' + email);
});
