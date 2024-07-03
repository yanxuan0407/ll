// 定义用户和密码对象
const users = {
    'yx': '123',
    'yxx': '123456'
};

// 登录表单提交事件处理
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
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
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
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
    // 注册成功后可以自动填写到登录表单
    document.getElementById('loginUsername').value = username;
    document.getElementById('loginPassword').value = password;
});

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        const buttonsDiv = document.getElementById('buttons');
        const welcomeMessageDiv = document.getElementById('welcomeMessage');
        const welcomeUsernameSpan = document.getElementById('welcomeUsername');
        const logoutButton = document.getElementById('logoutButton');

        if (buttonsDiv) buttonsDiv.style.display = 'none';
        if (welcomeMessageDiv) welcomeMessageDiv.style.display = 'block';
        if (welcomeUsernameSpan) welcomeUsernameSpan.textContent = username;
        if (logoutButton) logoutButton.style.display = 'block';
    }

    const highlightSection = document.getElementById('highlightSection');
    const items = highlightSection.querySelectorAll('.item');

    window.addEventListener('scroll', function() {
        const rect = highlightSection.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            items.forEach(item => item.classList.add('active-item'));
        } else {
            items.forEach(item => item.classList.remove('active-item'));
        }
    });
});

// 退出按钮点击事件处理
document.getElementById('logoutButton')?.addEventListener('click', function() {
    localStorage.removeItem('username');
    alert("您已成功退出");
    window.location.href = './index.html';
});
