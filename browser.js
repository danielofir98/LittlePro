// browser.js
document.addEventListener('DOMContentLoaded', () => {
    let isElectron = (typeof eRenderer !== 'undefined' && eRenderer);
  
    const urlInput = document.getElementById('url-input');
    const goBtn = document.getElementById('go-btn');
    const safeToggle = document.getElementById('safe-toggle');
  
    let safeOn = true;
  
    function buildURL(query) {
      let url = query;
      if (!/^https?:\/\//.test(url) && url.includes('.')) {
        url = 'http://' + url;
      }
      if (!url.includes('.')) {
        url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
      }
      if (safeOn) {
        if (url.includes('?')) url += '&safe=active';
        else url += '?safe=active';
      }
      return url;
    }
  
    if (isElectron) {
      // לא נטען אוטומטית show-browser כדי לא לחסום שורת חיפוש
    }
  
    goBtn.addEventListener('click', () => {
      const q = urlInput.value.trim();
      if (!q) return;
      const finalURL = buildURL(q);
      if (isElectron) {
        eRenderer.send('show-browser');
        eRenderer.send('load-url', finalURL);
      } else {
        window.open(finalURL, '_blank');
      }
    });
  
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        goBtn.click();
      }
    });
  
    safeToggle.addEventListener('click', () => {
      safeOn = !safeOn;
      safeToggle.textContent = safeOn ? 'Safe On' : 'Safe Off';
    });
  
    window.addEventListener('beforeunload', () => {
      if (isElectron) {
        eRenderer.send('hide-browser');
      }
    });
  });