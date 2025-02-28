// auth.js
document.addEventListener('DOMContentLoaded', () => {
  // אם אין sessionStorage loggedIn, נראה מודאל
  if (!sessionStorage.getItem('loggedIn')) {
    const authModal = document.getElementById('auth-modal');
    if (authModal) authModal.classList.remove('hidden');
  }

  const closeAuthModalBtn = document.getElementById('close-auth-modal');
  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', () => {
      document.getElementById('auth-modal').classList.add('hidden');
    });
  }

  const loginTabBtn = document.getElementById('login-tab-btn');
  const registerTabBtn = document.getElementById('register-tab-btn');
  const loginFormDiv = document.getElementById('login-form');
  const registerFormDiv = document.getElementById('register-form');

  function switchToLogin() {
    loginTabBtn.classList.add('active');
    registerTabBtn.classList.remove('active');
    loginFormDiv.classList.add('active');
    registerFormDiv.classList.remove('active');
  }
  function switchToRegister() {
    registerTabBtn.classList.add('active');
    loginTabBtn.classList.remove('active');
    registerFormDiv.classList.add('active');
    loginFormDiv.classList.remove('active');
  }

  if (loginTabBtn && registerTabBtn && loginFormDiv && registerFormDiv) {
    loginTabBtn.addEventListener('click', switchToLogin);
    registerTabBtn.addEventListener('click', switchToRegister);
  }

  // כתובת השרת בענן:
  const BASE_URL = "https://littlepro-production.up.railway.app";

  // הרשמה
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const password = document.getElementById('regPassword').value.trim();

      if (!username || !password) {
        document.getElementById('registerMsg').textContent = "יש למלא את כל השדות.";
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
          document.getElementById('registerMsg').textContent = "נרשמת בהצלחה!";
        } else {
          document.getElementById('registerMsg').textContent = data.message || "שגיאה בהרשמה";
        }
      } catch (err) {
        console.error(err);
        document.getElementById('registerMsg').textContent = "שגיאה בשרת.";
      }
    });
  }

  // התחברות
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!username || !password) {
        document.getElementById('loginMsg').textContent = "יש למלא שם משתמש וסיסמה.";
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!data.success) {
          document.getElementById('loginMsg').textContent = data.message || "שגיאה בהתחברות";
        } else {
          // התחברות הצליחה
          sessionStorage.setItem('loggedIn', username);
          document.getElementById('auth-modal').classList.add('hidden');
        }
      } catch (err) {
        console.error(err);
        document.getElementById('loginMsg').textContent = "שגיאה בהתחברות";
      }
    });
  }
});