// mail.js
document.addEventListener('DOMContentLoaded', () => {
    const mailTo = document.getElementById('mail-to');
    const mailSubject = document.getElementById('mail-subject');
    const mailBody = document.getElementById('mail-body');
    const sendBtn = document.getElementById('send-mail-btn');
    const sendStatus = document.getElementById('send-status');
  
    const checkInboxBtn = document.getElementById('check-inbox-btn');
    const inboxDiv = document.getElementById('inbox');
  
    // שליחה מקומית
    sendBtn.addEventListener('click', () => {
      const to = mailTo.value.trim();
      const subject = mailSubject.value.trim();
      const body = mailBody.value.trim();
      if (!to || !subject || !body) {
        sendStatus.textContent = 'יש למלא את כל השדות.';
        return;
      }
  
      let sentMails = JSON.parse(localStorage.getItem('sent_mails')) || [];
      sentMails.push({
        to, subject, body, timestamp: new Date().toISOString()
      });
      localStorage.setItem('sent_mails', JSON.stringify(sentMails));
  
      let inboxMails = JSON.parse(localStorage.getItem('inbox_mails')) || [];
      inboxMails.push({
        from: "little@mvp.com",
        subject, body,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('inbox_mails', JSON.stringify(inboxMails));
  
      sendStatus.style.color = 'green';
      sendStatus.textContent = 'נשלח בהצלחה (MVP מקומי).';
      mailTo.value = '';
      mailSubject.value = '';
      mailBody.value = '';
    });
  
    checkInboxBtn.addEventListener('click', () => {
      let inboxMails = JSON.parse(localStorage.getItem('inbox_mails')) || [];
      inboxDiv.innerHTML = '';
      if (inboxMails.length === 0) {
        inboxDiv.textContent = 'אין הודעות חדשות.';
        return;
      }
      const reversed = [...inboxMails].reverse();
      reversed.forEach((m) => {
        const div = document.createElement('div');
        div.style.border = '1px solid #ccc';
        div.style.margin = '5px';
        div.style.padding = '5px';
        div.style.borderRadius = '5px';
        div.innerHTML = `
          <strong>From:</strong> ${m.from}<br>
          <strong>Subject:</strong> ${m.subject}<br>
          <p>${m.body}</p>
          <em>${new Date(m.timestamp).toLocaleString()}</em>
        `;
        inboxDiv.appendChild(div);
      });
    });
  });