// userData.js
function getAllUsers() {
    const all = JSON.parse(localStorage.getItem('all_users')) || [];
    return all;
  }
  function saveAllUsers(users) {
    localStorage.setItem('all_users', JSON.stringify(users));
  }
  
  function registerUser(username, password, payment) {
    let all = getAllUsers();
    const existing = all.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      return { success: false, message: "שם משתמש כבר קיים" };
    }
    const newUser = {
      username,
      password,
      payment,
      userId: String(Math.floor(Math.random() * 1000000)),
      bio: "",
      friends: []
    };
    all.push(newUser);
    saveAllUsers(all);
    return { success: true, message: "נרשמת בהצלחה!" };
  }
  
  function loginUser(username, password) {
    let all = getAllUsers();
    const user = all.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return { success: false, message: "משתמש לא קיים" };
    }
    if (user.password !== password) {
      return { success: false, message: "סיסמה שגויה" };
    }
    return { success: true, message: "התחברת בהצלחה", user };
  }
  
  function getCurrentUser() {
    const username = sessionStorage.getItem('loggedIn');
    if (!username) return null;
    let all = getAllUsers();
    const user = all.find(u => u.username.toLowerCase() === username.toLowerCase());
    return user || null;
  }
  
  function updateUser(userData) {
    let all = getAllUsers();
    const idx = all.findIndex(u => u.userId === userData.userId);
    if (idx >= 0) {
      all[idx] = userData;
      saveAllUsers(all);
      return true;
    }
    return false;
  }