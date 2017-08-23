try {
    var obj = new ActiveXObject('WScript.network');    
    localStorage.setItem('auto_login_user', JSON.stringify({ 'email': obj.UserName, 'password': obj.UserDomain }));
} catch (err) {
    console.log(err);
}