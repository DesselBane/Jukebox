win.on('close', (event) => {
  if (!isQuitting) {
    event.preventDefault();
    win.hide();
  }
  else {
    win = null;
    app.quit();
  }
}
