// main.js
const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let browserView = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  // טוען את home.html כעמוד ראשון
  mainWindow.loadFile(path.join(__dirname, 'home.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// BrowserView לדפדפן פנימי (אופציונלי)
ipcMain.on('show-browser', () => {
  if (!browserView) {
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
  if (browserView) {
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
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});