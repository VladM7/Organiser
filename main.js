const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeTheme,
  Notification,
  Tray,
} = require("electron");
let AutoLaunch = require("auto-launch");
const fs = require("fs");
const path = require("path");
const execPath = path.dirname(process.execPath); //"D:/Info/Java, Electron, etc/To_Do"; //

let win = null;
let tray;
let isQuiting;

const prefs = JSON.parse(
  fs.readFileSync(path.join(execPath, "/config/settings.json"))
);

function send_notification(text, dueDate) {
  if (Notification.isSupported()) {
    let rawData1 = fs.readFileSync(
      path.join(execPath, "config/notifications.json")
    );
    let rawData2 = fs.readFileSync(
      path.join(execPath, "config/variables.json")
    );
    let vars = JSON.parse(rawData2);
    let structuredData = JSON.parse(rawData1);
    structuredData.title = text;
    if (dueDate.month && dueDate.day && dueDate.year) {
      structuredData.body =
        "Due on " +
        dueDate.month +
        "/" +
        dueDate.day +
        ", " +
        Math.round((vars.completedItems / vars.totalItems) * 100) +
        "% of all tasks completed";
    } else {
      structuredData.body =
        Math.round((vars.completedItems / vars.totalItems) * 100) +
        "% of all tasks completed";
    }
    const notification = new Notification(structuredData);
    notification.show();
  } else {
    console.warn("Notifications not supported on this system.");
  }
}

function date_compare(
  month,
  day,
  year,
  hour,
  minute,
  monthNow,
  dayNow,
  yearNow,
  hourNow,
  minuteNow
) {
  if (
    year < yearNow ||
    (year == yearNow && month < monthNow) ||
    (year == yearNow && month == monthNow && day < dayNow) ||
    (year == yearNow && month == monthNow && day == dayNow && hour < hourNow) ||
    (year == yearNow &&
      month == monthNow &&
      day == dayNow &&
      hour == hourNow &&
      minute < minuteNow) ||
    (year == yearNow &&
      month == monthNow &&
      day == dayNow &&
      hour == hourNow &&
      minute == minuteNow)
  )
    return 1;
  return 0;
}

function notifications_check() {
  let today = new Date();
  let monthNow = today.getMonth() + 1,
    dayNow = today.getDate(),
    yearNow = today.getFullYear(),
    hourNow = today.getHours(),
    minutesNow = today.getMinutes();
  //console.log(monthNow, dayNow, yearNow, hourNow, minutesNow);
  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  let structuredData = JSON.parse(rawData);
  for (i in structuredData)
    if (
      structuredData[i].due_date &&
      date_compare(
        parseInt(structuredData[i].due_date.month),
        parseInt(structuredData[i].due_date.day) - 1,
        parseInt(structuredData[i].due_date.year) + 2000,
        parseInt(structuredData[i].due_date.hour),
        parseInt(structuredData[i].due_date.minute),
        monthNow,
        dayNow,
        yearNow,
        hourNow,
        minutesNow
      ) &&
      structuredData[i].notif == false
    ) {
      structuredData[i].notif = true;
      send_notification(structuredData[i].text, structuredData[i].due_date);
    }
  fs.writeFileSync(
    path.join(execPath, "/config/items.json"),
    JSON.stringify(structuredData, null, 2)
  );
}

app.on("ready", function () {
  win = new BrowserWindow({
    show: false,
    width: 1000,
    height: 800,
    icon: path.join(execPath, "/build/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
    },
  });

  win.once("ready-to-show", () => {
    win.show();
  });

  win.loadFile(path.join(__dirname, "src/index.html"));

  nativeTheme.themeSource = "light";

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Send Test Notification",
          click: function () {
            if (Notification.isSupported()) {
              let rawData = fs.readFileSync(
                path.join(execPath, "/config/notifications.json")
              );
              let structuredData = JSON.parse(rawData);
              const notification = new Notification(structuredData);
              notification.show();
            } else {
              console.warn("Notifications not supported on this system.");
            }
          },
        },
        { type: "separator" },
        { role: "quit" },
      ],
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
          label: "Reset progress",
          click: function () {
            win.webContents.send("reset-progress");
          },
        },
        {
          label: "Preferences",
          click: () => {
            const preferences = new BrowserWindow({
              parent: win,
              width: 600,
              height: 400,
              icon: path.join(__dirname, "assets/to-do-list.ico"),
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                nativeWindowOpen: true,
              },
            });
            preferences.setMenu(null);

            preferences.loadFile(path.join(__dirname, "src/preferences.html"));
          },
        },
        { type: "separator" },
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            const about = new BrowserWindow({
              parent: win,
              width: 600,
              height: 500,
              icon: path.join(__dirname, "assets/to-do-list.ico"),
              webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: true,
                contextIsolation: false,
                nativeWindowOpen: true,
              },
            });
            about.setMenu(null);

            about.loadFile(path.join(__dirname, "src/about.html"));
          },
        },
      ],
    },
  ];

  if (prefs.runSt == true) {
    let autoLauncher = new AutoLaunch({
      name: "Organiser",
      path: app.getPath("exe"),
    });

    autoLauncher.enable();

    autoLauncher
      .isEnabled()
      .then(function (isEnabled) {
        if (isEnabled) return;
        autoLauncher.enable();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (prefs.runBg == true) {
    tray = new Tray(path.join(execPath, "/build/icon.ico"));
    tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: "Open App",
          click: function () {
            win.show();
          },
        },
        {
          label: "Quit",
          click: function () {
            isQuiting = true;
            app.quit();
          },
        },
      ])
    );

    win.on("close", function (event) {
      if (!isQuiting) {
        event.preventDefault();
        win.hide();
        event.returnValue = false;
      }
    });
  }

  setInterval(function () {
    notifications_check();
    //console.log("works");
  }, 5000);

  //console.log(date_compare(5, 21, 2022, 10, 26, 5, 21, 2022, 10, 20));
});

ipcMain.on("send-notif", (event) => {
  if (Notification.isSupported()) {
    let rawData = fs.readFileSync("config/notifications.json");
    let structuredData = JSON.parse(rawData);
    const notification = new Notification(structuredData);
    notification.show();
  } else {
    console.warn("Notifications not supported on this system.");
  }
});

ipcMain.on("open-calendar-view", (event) => {
  const calendar = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(execPath, "/build/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  calendar.setMenu(null);
  calendar.loadFile(path.join(__dirname, "src/calendarView.html"));
});
ipcMain.on("open-charts-view", (event) => {
  const charts = new BrowserWindow({
    width: 800,
    height: 500,
    icon: path.join(execPath, "/build/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  charts.setMenu(null);
  charts.loadFile(path.join(__dirname, "src/chartsView.html"));
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
