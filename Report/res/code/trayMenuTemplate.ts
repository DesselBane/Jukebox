let trayMenuTemplate = [
  {
    label: 'Jukebox APP',
    id: 'app',
    click: () => this._win.show(),
    position: 'first'
  },
  {
    label: 'Quit Jukebox',
    click: () => {
      this._electronService.ipcRenderer.send('quitApplication');
    },
    position: 'last',
    id: 'quit'
  }

];
