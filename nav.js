// nav.js
document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('nav-home');
    const backBtn = document.getElementById('nav-back');
    const forwardBtn = document.getElementById('nav-forward');
    const refreshBtn = document.getElementById('nav-refresh');
  
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        window.location.href = "home.html";
      });
    }
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back();
      });
    }
    if (forwardBtn) {
      forwardBtn.addEventListener('click', () => {
        window.history.forward();
      });
    }
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('rotate');
        setTimeout(() => {
          refreshBtn.classList.remove('rotate');
          window.location.reload();
        }, 1000);
      });
    }
  });