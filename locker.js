// locker.js
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const filesContainer = document.getElementById('files-container');
  
    function loadFiles() {
      let lockerFiles = JSON.parse(localStorage.getItem('locker_files')) || [];
      filesContainer.innerHTML = '';
      lockerFiles.forEach((f) => {
        const div = document.createElement('div');
        div.classList.add('locker-file-item');
        div.textContent = `${f.name} - ${f.size} bytes [יעד: ${f.dest}]`;
        filesContainer.appendChild(div);
      });
    }
  
    function saveFiles(files) {
      localStorage.setItem('locker_files', JSON.stringify(files));
    }
  
    if (uploadBtn) {
      uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!fileInput.files.length) return;
  
        const destValue = document.querySelector('input[name="dest"]:checked').value;
        let lockerFiles = JSON.parse(localStorage.getItem('locker_files')) || [];
  
        for (let f of fileInput.files) {
          lockerFiles.push({
            name: f.name,
            size: f.size,
            type: f.type,
            lastModified: f.lastModified,
            dest: destValue
          });
        }
        saveFiles(lockerFiles);
        loadFiles();
        fileInput.value = '';
      });
    }
    loadFiles();
  });