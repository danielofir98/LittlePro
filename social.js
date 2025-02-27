// social.js
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = 'home.html';
      return;
    }
  
    const displayUsername = document.getElementById('display-username');
    const displayUserId = document.getElementById('display-userid');
  
    displayUsername.textContent = currentUser.username;
    displayUserId.textContent = currentUser.userId;
  
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const profileCloseBtn = document.getElementById('profile-close-btn');
    const profileSaveBtn = document.getElementById('profile-save-btn');
    const profileNameInput = document.getElementById('profile-name');
    const profileBioInput = document.getElementById('profile-bio');
  
    editProfileBtn.addEventListener('click', () => {
      profileNameInput.value = currentUser.username;
      profileBioInput.value = currentUser.bio || "";
      editProfileModal.classList.remove('hidden');
    });
    profileCloseBtn.addEventListener('click', () => {
      editProfileModal.classList.add('hidden');
    });
    profileSaveBtn.addEventListener('click', () => {
      currentUser.username = profileNameInput.value.trim() || currentUser.username;
      currentUser.bio = profileBioInput.value.trim();
      updateUser(currentUser);
      editProfileModal.classList.add('hidden');
      displayUsername.textContent = currentUser.username;
    });
  
    let allPosts = JSON.parse(localStorage.getItem('all_posts')) || [];
    const postText = document.getElementById('post-text');
    const postSubmit = document.getElementById('post-submit');
    const feedContainer = document.getElementById('feed-container');
  
    function savePosts(posts) {
      localStorage.setItem('all_posts', JSON.stringify(posts));
    }
  
    function renderPosts() {
      feedContainer.innerHTML = '';
      const userAndFriends = [currentUser.userId, ...(currentUser.friends || [])];
      const relevantPosts = allPosts.filter(p => userAndFriends.includes(p.userId)).reverse();
      relevantPosts.forEach(p => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('feed-post');
        const metaDiv = document.createElement('div');
        metaDiv.classList.add('meta');
        metaDiv.textContent = `User: ${p.username} | ${new Date(p.timestamp).toLocaleString()}`;
        const contentP = document.createElement('p');
        contentP.textContent = p.content;
        postDiv.appendChild(metaDiv);
        postDiv.appendChild(contentP);
        feedContainer.appendChild(postDiv);
      });
    }
  
    if (postSubmit) {
      postSubmit.addEventListener('click', () => {
        const content = postText.value.trim();
        if (!content) return;
        const newPost = {
          userId: currentUser.userId,
          username: currentUser.username,
          content: content,
          timestamp: new Date().toISOString()
        };
        allPosts.push(newPost);
        savePosts(allPosts);
        postText.value = '';
        renderPosts();
      });
    }
    renderPosts();
  
    const friendIdInput = document.getElementById('friend-id');
    const addFriendBtn = document.getElementById('add-friend-btn');
    const friendsList = document.getElementById('friends-list');
  
    function renderFriends() {
      friendsList.innerHTML = '';
      (currentUser.friends || []).forEach(fid => {
        const li = document.createElement('li');
        li.textContent = `Friend ID: ${fid}`;
        friendsList.appendChild(li);
      });
    }
    renderFriends();
  
    addFriendBtn.addEventListener('click', () => {
      const fid = friendIdInput.value.trim();
      if (!fid) return;
      if (currentUser.friends.includes(fid)) return;
      currentUser.friends.push(fid);
      updateUser(currentUser);
      friendIdInput.value = '';
      renderFriends();
      renderPosts();
    });
  
    let allMessages = JSON.parse(localStorage.getItem('all_messages')) || [];
    const pmText = document.getElementById('pm-text');
    const pmRecipient = document.getElementById('pm-recipient');
    const sendPmBtn = document.getElementById('send-pm-btn');
    const pmList = document.getElementById('pm-list');
  
    function saveMessages(msgs) {
      localStorage.setItem('all_messages', JSON.stringify(msgs));
    }
    function renderMessages() {
      pmList.innerHTML = '';
      const relevant = allMessages.filter(m => m.fromId === currentUser.userId || m.toId === currentUser.userId);
      relevant.reverse().forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `[${msg.fromName} → ${msg.toId}] : ${msg.content} (${new Date(msg.timestamp).toLocaleString()})`;
        pmList.appendChild(li);
      });
    }
    renderMessages();
  
    sendPmBtn.addEventListener('click', () => {
      const content = pmText.value.trim();
      const recipient = pmRecipient.value.trim();
      if (!content || !recipient) return;
      const newMsg = {
        fromId: currentUser.userId,
        fromName: currentUser.username,
        toId: recipient,
        content: content,
        timestamp: new Date().toISOString()
      };
      allMessages.push(newMsg);
      saveMessages(allMessages);
      pmText.value = '';
      pmRecipient.value = '';
      renderMessages();
    });
  });