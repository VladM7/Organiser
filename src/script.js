const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

const execPath = "C:/Files/Electron/To_Do/"; //path.dirname(process.execPath); //
let nrTasks = 0,
  clearedTasks = 0,
  totalTasks = 0,
  editMode = 0;

var colors = [
  "#ffffff", //white
  "#1a1a1a", //bg
  "#353B40",
  "#5E6366",
  /*text*/
  "#000000",
];
// var activeMode = 0;

/* function init() {
  var array = fs.readFileSync(pathName).toString().split("\n");
  for (i in array) {
    additem(array[i], 0);
    console.log(array[i]);
  }
} */

function init_json() {
  var rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  var structuredData = JSON.parse(rawData);
  for (i in structuredData) {
    show_items(structuredData[i].text);
    nrTasks++;
  }
  totalTasks = nrTasks;

  //* variables JSON
  var rawData = fs.readFileSync(path.join(execPath, "/config/variables.json"));
  var structuredData = JSON.parse(rawData);
  clearedTasks = structuredData.completedItems;
  totalTasks = structuredData.totalItems;
}

/* const removeLines = (data, lines = []) => {
  data += "";
  return data
    .split("\n")
    .filter((val, idx) => lines.indexOf(idx) === -1)
    .join("\n");
}; */

/* $("#errorButton").click(() => {
  ipc.send('open-error-dialog');
}); */

/* 
prints "pong"
console.log(ipcRenderer.sendSync("synchronous-message", "ping"));

prints "pong"
ipcRenderer.on("asynchronous-reply", (_, ...args) => console.log(...args));

ipcRenderer.send("asynchronous-message", "ping"); */

/* function additem(textData, appendData) {
  if (textData.trim() != "") {
    //* HTML
    $(".list-group").append(
      `<div class="item"><i class="listicon far fa-circle"></i>` +
        "\xa0\xa0\xa0\xa0" +
        textData +
        `<div class="ui divider"></div></div>`
    );

    //* TXT
    if (appendData == 1) {
      fs.appendFile(pathName, "\n" + textData + "\n", function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    }

    // Reset HTML
    $("#newTask").val("");
  }
} */

function show_items(textData) {
  $(".list-group").append(
    `<div class="item"><i class="listicon far fa-circle"></i>` +
      "\xa0\xa0\xa0\xa0" +
      textData +
      `<i class="editIcon pencil alternate icon"></i><div class="ui divider"></div></div>`
  );
}

function additem_json(textData) {
  //* HTML
  show_items(textData);

  //* JSON
  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  let structuredData = JSON.parse(rawData);
  //console.log(word);
  let prototype = { text: textData };
  structuredData[nrTasks++] = prototype;

  //* totaltasks JSON
  totalTasks++;
  let rawData2 = fs.readFileSync(path.join(execPath, "/config/variables.json"));
  let structuredData2 = JSON.parse(rawData2);
  structuredData2.totalItems = totalTasks;
  fs.writeFileSync(
    path.join(execPath, "/config/variables.json"),
    JSON.stringify(structuredData2, null, 2)
  );
  //structuredData[word + nrTasks]["fav"] = textData;

  console.log(structuredData);
  fs.writeFileSync(
    path.join(execPath, "/config/items.json"),
    JSON.stringify(structuredData, null, 2)
  );

  // Reset HTML
  $("#newTask").val("");

  //* UI
  progressbar();
  console.log({ nrTasks, totalTasks });
}

function clearAll() {
  //* JSON
  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  let structuredData = JSON.parse(rawData);
  structuredData.splice(0, nrTasks);
  console.log(structuredData[0]);
  fs.writeFileSync(
    path.join(execPath, "/config/items.json"),
    JSON.stringify(structuredData, null, 2)
  );
  nrTasks = 0;

  //* HTML
  $(".list-group")
    .children()
    .fadeOut("normal", function () {
      $(".list-group").children().remove();
    });
}

function clear_item(item) {
  //* JSON
  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  let structuredData = JSON.parse(rawData);
  jQuery(structuredData).each(function (i) {
    //console.log(structuredData[i].text);
    if (structuredData[i].text.trim() == item.text().trim()) {
      structuredData.splice(i, 1);
      return false;
    }
  });
  fs.writeFileSync(
    path.join(execPath, "/config/items.json"),
    JSON.stringify(structuredData, null, 2)
  );
  nrTasks--;
  clearedTasks++;

  //* HTML
  item.children("i").remove();
  item.prepend(`<i class="listicon far fa-times-circle"></i>`);
  item.fadeOut("slow", function () {
    item.remove();
  });

  //* crearedTasks JSON
  rawData = fs.readFileSync(path.join(execPath, "/config/variables.json"));
  structuredData = JSON.parse(rawData);
  structuredData.completedItems = clearedTasks;
  fs.writeFileSync(
    path.join(execPath, "/config/variables.json"),
    JSON.stringify(structuredData, null, 2)
  );

  //* UI
  progressbar();
  console.log({ nrTasks, totalTasks });
}

//! Reload after reset_edit_task if updating not working properly

function reset_edit_task(task, itemText) {
  set_due_date(task);
  console.log(
    "html: " +
      $(task).html() +
      "\ntext: " +
      itemText +
      "\npos: " +
      $(task).index()
  );
  //* HTML
  $(task).html(
    `<i class="listicon far fa-circle"></i>` +
      "\xa0\xa0\xa0\xa0" +
      itemText +
      `<i class="editIcon pencil alternate icon"></i><div class="ui divider"></div></div>`
  );

  //* JSON
  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  let structuredData = JSON.parse(rawData);
  //console.log(structuredData[pos]);
  structuredData[$(task).index()].text = itemText;
  fs.writeFileSync(
    path.join(execPath, "/config/items.json"),
    JSON.stringify(structuredData, null, 2)
  );
  editMode = 0;
}

function show_due_date(item) {
  let position = $(item).index();
  //console.log("yyyyyyyyyyyyyyyyyyyy" + position);
  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  let structuredData = JSON.parse(rawData);
  if (!structuredData[position].due_date) return;
  $("#editDate").val(
    20 +
      structuredData[position].due_date.year +
      "-" +
      structuredData[position].due_date.month +
      "-" +
      structuredData[position].due_date.day
  );
  $("#editTime").val(
    structuredData[position].due_date.hour +
      ":" +
      structuredData[position].due_date.minute
  );
}

function set_due_date(item) {
  let position = $(item).index();
  let dateTextbox = $("#editDate").val();
  let timeTextbox = $("#editTime").val();
  console.log(timeTextbox);
  //console.log("yyyyyyyyyyyyyyyyyyyy" + textbox);
  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  let structuredData = JSON.parse(rawData);
  if (!structuredData[position].due_date)
    structuredData[position].due_date = {};
  if (dateTextbox) {
    structuredData[position].due_date.month = dateTextbox[5] + dateTextbox[6];
    structuredData[position].due_date.day = dateTextbox[8] + dateTextbox[9];
    structuredData[position].due_date.year = dateTextbox[2] + dateTextbox[3];
  }
  if (timeTextbox) {
    structuredData[position].due_date.hour = timeTextbox[0] + timeTextbox[1];
    structuredData[position].due_date.minute = timeTextbox[3] + timeTextbox[4];
  }
  structuredData[position].notif = false;
  fs.writeFileSync(
    path.join(execPath, "/config/items.json"),
    JSON.stringify(structuredData, null, 2)
  );
}

function edit_task(item) {
  console.warn($(item).index());

  editMode = 1;

  //* HTML
  $(item).html(
    `<i class="listicon far fa-circle"></i>
    <div class="ui transparent input"><input class="editItem prompt try" id="editTask" value="` +
      item.text().trim() +
      `"/></div><div class="ui transparent input">
      <input type="date" class="editItem dueDate prompt try" id="editDate" value=""
      value="2022-07-22"
       min="2022-01-01" max="2022-12-31"/><input type="time" id="editTime" name="appt"
       min="00:00" max="24:00"/></div>
      <button type="button" class="ui button" id="additemtest">Enter</button>
    <div class="ui divider"></div>`
  );
  $(item).children("input").val(item.text().trim());
  show_due_date(item);
  //console.log("pos still: " + pos);
}

/* function find_position(itemText) {
  let pos = -1;
  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  let structuredData = JSON.parse(rawData);
  jQuery(structuredData).each(function (i) {
    if (structuredData[i].text.trim() == itemText) {
      pos = i;
      //console.log("found at: " + pos);
      return 0;
    }
  });
  //console.log({ pos });
  fs.writeFileSync(path.join(execPath, "/config/items.json"), JSON.stringify(structuredData, null, 2));
  if (pos == -1) console.error("Error: Could not find the item to edit");
  return pos;
}
*/

function progressbar() {
  let prog = (clearedTasks / totalTasks) * 100;
  if (totalTasks == 0) prog = 0;
  $("#topProgressbar").progress({
    percent: prog,
  });
}

function resetProgress() {
  clearedTasks = 0;
  totalTasks = nrTasks;

  //* variables JSON
  let rawData = fs.readFileSync(path.join(execPath, "/config/variables.json"));
  let structuredData = JSON.parse(rawData);
  structuredData.completedItems = 0;
  structuredData.totalItems = 0;
  fs.writeFileSync(
    path.join(execPath, "/config/variables.json"),
    JSON.stringify(structuredData, null, 2)
  );

  $("#topProgressbar").progress({
    percent: 0,
  });
}

function day_of_week() {
  let day = new Date().getDay();
  let day_name = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  day = day_name[day];
  let prev_data = $(".weekdayText").text().trim();
  //console.log(day + " " + prev_data);
  if (day != prev_data) {
    $(".weekdayText").text(day);
  }
}

function init_settings() {
  let rawData = fs.readFileSync(path.join(execPath, "/config/settings.json"));
  let structuredData = JSON.parse(rawData);
  if (structuredData.runBg == true) $("#runBgDiv").checkbox("check");
  else $("#runBgDiv").checkbox("uncheck");
  if (structuredData.runSt == true) $("#runStDiv").checkbox("check");
  else $("#runStDiv").checkbox("uncheck");
}

function initialize() {
  init_json();
  progressbar();
  day_of_week();
  init_settings();
}

$(function () {
  initialize();
  $("#additem").on("click", () => {
    let taskText = $("#newTask").val();
    additem_json(taskText);
  });
  $(document).keyup(function (event) {
    if (event.which === 13 && !editMode) {
      additem_json($("#newTask").val());
      $("#newTask").val("");
    }
  });
  $(document).on("click", ".item", function () {
    if (!editMode) clear_item($(this));
  });
  $(document).on("click", ".editIcon", function () {
    //console.log("right click");
    if (!editMode) {
      var item = $(this).parent();
      //console.log("ppppppppppppp" + item.html());
      //console.log(item.html());
      edit_task(item);
      $("#additemtest").on("click", () => {
        reset_edit_task(item, item.children("div").children("input").val());
      });
    }
  });
  $(document).on("mouseenter", ".item", function () {
    //$(this).css("text-decoration", "line-through");
    $(this).children(".listicon").remove();
    $(this).prepend(`<i class="listicon far fa-times-circle"></i>`);
    //$(this).html(`<i class="listicon far fa-times-circle"></i>`);
    //$(this).remove();
  });
  $(document).on("mouseleave", ".item", function () {
    //$(this).css("text-decoration", "none");
    $(this).children(".listicon").remove();
    $(this).prepend(`<i class="listicon far fa-circle"></i>`);
    //$(this).html(`<i class="listicon far fa-circle"></i>`);
  });

  ipcRenderer.on("clear-all", (event) => {
    clearAll();
    //console.log("cleared all");
  });
  ipcRenderer.on("reset-progress", (event) => {
    resetProgress();
  });

  $("#darkMode").on("change", function () {
    if ($("#darkMode").is(":checked")) {
      activeMode = 1;
      $("body").css("background-color", colors[1]);
      $("body").css("color", colors[0]);
      $("#newTask").css("background-color", colors[2]);
      $(".item").css("color", colors[0]);
      $(".item").css("background-color", colors[2]);
      $("#newTask").addClass("lightgray");
      $("#newTask").css("color", colors[0]);
    } else if ($("#darkMode").is(":not(:checked)")) {
      activeMode = 0;
      $("body").css("background-color", colors[0]);
      $("body").css("color", colors[3]);
      $("#newTask").css("background-color", colors[0]);
      $(".item").css("background-color", colors[0]);
      $(".item").css("color", colors[3]);
      $("#newTask").removeClass("lightgray");
      $("#newTask").css("color", colors[3]);
    }
  });

  //* settings
  $("#runBg").on("change", function () {
    //console.log("ok");
    let rawData = fs.readFileSync(path.join(execPath, "/config/settings.json"));
    let structuredData = JSON.parse(rawData);
    if ($("#runBg").is(":checked")) structuredData.runBg = true;
    else structuredData.runBg = false;
    fs.writeFileSync(
      path.join(execPath, "/config/settings.json"),
      JSON.stringify(structuredData, null, 2)
    );
  });
  $("#runSt").on("change", function () {
    //console.log("ok");
    let rawData = fs.readFileSync(path.join(execPath, "/config/settings.json"));
    let structuredData = JSON.parse(rawData);
    if ($("#runSt").is(":checked")) structuredData.runSt = true;
    else structuredData.runSt = false;
    fs.writeFileSync(
      path.join(execPath, "/config/settings.json"),
      JSON.stringify(structuredData, null, 2)
    );
  });
  //progressbar();
  //additem_json("lol");
});
