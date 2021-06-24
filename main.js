const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

let win = null;

/* ipc.on("open-error-dialog", function (event) {
  dialog.showErrorBox("Error", "You clicked me you mf btch!!!");
}); */

app.on("ready", function () {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile(path.join(__dirname, "index.html"));
  /* ipcMain.on("asynchronous-message", (event, arg) => {
    console.log(arg); // prints "ping"
    event.sender.send("asynchronous-reply", "pong");
  });

  ipcMain.on("synchronous-message", (event, arg) => {
    console.log(arg); // prints "ping"
    event.returnValue = "pong";
  }); */
  /* ipcMain.on("introduced-task", (event, arg) => {
    console.log(arg);
  }); */

  const template = [
    {
      label: "File",
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Clear All",
          click: function () {
            win.webContents.send("clear-all");
          },
        },
        {
          label: "Preferences",
          click: function () {},
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "F5",
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              // on reload, start fresh and close any old
              // open secondary windows
              if (focusedWindow.id === 1) {
                BrowserWindow.getAllWindows().forEach((win) => {
                  if (win.id > 1) win.close();
                });
              }
              focusedWindow.reload();
            }
          },
        },
        {
          label: "Toggle Dev Tools",
          accelerator: "F12",
          click: () => {
            win.webContents.toggleDevTools();
          },
        },
      ],
    },
    {
      label: "Help",
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    loadMainWindow();
  }
});
