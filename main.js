// main.js
const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let browserView = null;

function createWindow() {
  // משפרים גודל התחלתי, כותרים (title) ואייקון:
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Little Pro",
    icon: path.join(__dirname, 'assets', 'icon.png'), // אם תרצה אייקון משלך
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // טוען את דף הבית
  mainWindow.loadFile(path.join(__dirname, 'home.html'));

  // מסיר תפריט ברירת מחדל (אופציונלי):
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// שימוש ב-BrowserView (סימולציית "דפדפן"):
ipcMain.on('show-browser', () => {
  if (!browserView && mainWindow) {
    browserView = new BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    mainWindow.setBrowserView(browserView);

    const bounds = mainWindow.getContentBounds();
    const topBarHeight = 100;
    const bottomNavHeight = 70;
    browserView.setBounds({
      x: 0,
      y: topBarHeight,
      width: bounds.width,
      height: bounds.height - topBarHeight - bottomNavHeight
    });
    browserView.setAutoResize({ width: true, height: true });
  }
});

ipcMain.on('hide-browser', () => {
  if (browserView && mainWindow) {
    mainWindow.removeBrowserView(browserView);
    browserView = null;
  }
});

ipcMain.on('load-url', (event, url) => {
  if (browserView) {
    browserView.webContents.loadURL(url);
  }
});
ipcMain.on('go-back', () => {
  if (browserView && browserView.webContents.canGoBack()) {
    browserView.webContents.goBack();
  }
});
ipcMain.on('go-forward', () => {
  if (browserView && browserView.webContents.canGoForward()) {
    browserView.webContents.goForward();
  }
});
ipcMain.on('reload', () => {
  if (browserView) {
    browserView.webContents.reload();
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // ב-Windows/Linux נסגור את האפליקציה
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // macOS: יוצרים חלון חדש אם אין חלון פתוח
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});