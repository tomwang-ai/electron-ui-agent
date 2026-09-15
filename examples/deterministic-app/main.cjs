const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const fault = process.env.DETERMINISTIC_FAULT ?? ''
if (!['', 'reset', 'filter', 'items'].includes(fault)) {
  throw new Error('DETERMINISTIC_FAULT must be reset, filter, items, or empty')
}

app.whenReady().then(() => {
  const window = new BrowserWindow({
    width: 860,
    height: 760,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  })
  window.loadFile(path.join(__dirname, 'index.html'), { query: { fault } })
})

app.on('window-all-closed', () => app.quit())
