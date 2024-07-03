// 定义用户和密码对象
const users = {
    'yx': '123',
    'yxx': '123456'
  };
  
  // 获取按钮
  const logBtn = document.querySelector('#sign_in');
  logBtn.addEventListener('click', login);
  
  function login() {
    // 拿到用户名
    const usernameInput = document.querySelector('#username').value;
    // 拿到密码
    const passwordInput = document.querySelector('#password').value;
  
    if (users.hasOwnProperty(usernameInput)) {
      const targetPassword = users[usernameInput];
      if (passwordInput === targetPassword) {
        alert("登录成功");
      } else {
        alert("登录失败，密码不对");
      }
    } else {
      alert('用户不存在，请注册！');
    }
  }