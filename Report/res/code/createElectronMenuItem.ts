public createElectronMenuItem(menuItem: AngularMenuItem): Electron.MenuItem {
  let subItems = [];

  menuItem.submenu.forEach(value => {
    subItems.push(this.createElectronMenuItem(value));
  });

  let item = new this._electronService.remote.MenuItem({
    label: menuItem.label,
    click: () => menuItem.click(),
    submenu: subItems.length > 0 ? subItems : null,
    type: menuItem.type,
    enabled: menuItem.enabled,
    visible: menuItem.visible,
    id: menuItem.id,
    position: menuItem.position,
    accelerator: menuItem.accelerator
  });

  let visibleChangedSub = menuItem.visibleChanged.subscribe(() => {
    let oldMenuItem = this._electronService.remote.Menu
                          .getApplicationMenu().getMenuItemById(menuItem.id);
    if (oldMenuItem != null)
      oldMenuItem.visible = menuItem.visible;
  });

  let enabledChanged = menuItem.enabledChanged.subscribe(() => {
    let oldMenuItem = this._electronService.remote.Menu
                          .getApplicationMenu().getMenuItemById(menuItem.id);

    if (oldMenuItem != null)
      oldMenuItem.enabled = menuItem.enabled;
  });

  menuItem.subscriptions.push(visibleChangedSub, enabledChanged);
  return item;
}
