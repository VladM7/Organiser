const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

let pathName = path.join(__dirname, "saved.txt");
let nrTasks = 0,
  clearedTasks = 0,
  totalTasks = 0,
  editMode = 0;

var colors = [
  /*background*/
  "#FFFFFF",
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
  var rawData = fs.readFileSync("src/test.json");
  var structuredData = JSON.parse(rawData);
  for (i in structuredData) {
    show_items(structuredData[i].text);
    nrTasks++;
  }
  totalTasks = nrTasks;
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
      `<div class="ui divider"></div></div>`
  );
}

function additem_json(textData) {
  //* HTML
  show_items(textData);

  //* JSON
  let rawData = fs.readFileSync("src/test.json");
  let structuredData = JSON.parse(rawData);
  //console.log(word);
  let prototype = { text: textData };
  structuredData[nrTasks++] = prototype;
  totalTasks++;
  //structuredData[word + nrTasks]["fav"] = textData;

  console.log(structuredData);
  fs.writeFileSync("src/test.json", JSON.stringify(structuredData, null, 2));

  // Reset HTML
  $("#newTask").val("");

  //* UI
  progressbar();
  console.log({ nrTasks, totalTasks });
}

function clearAll() {
  //* JSON
  let rawData = fs.readFileSync("src/test.json");
  let structuredData = JSON.parse(rawData);
  structuredData.splice(0, nrTasks);
  console.log(structuredData[0]);
  fs.writeFileSync("src/test.json", JSON.stringify(structuredData, null, 2));
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
  let rawData = fs.readFileSync("src/test.json");
  let structuredData = JSON.parse(rawData);
  jQuery(structuredData).each(function (i) {
    //console.log(structuredData[i].text);
    if (structuredData[i].text.trim() == item.text().trim()) {
      structuredData.splice(i, 1);
      return false;
    }
  });
  fs.writeFileSync("src/test.json", JSON.stringify(structuredData, null, 2));
  nrTasks--;
  clearedTasks++;

  //* HTML
  item.children("i").remove();
  item.prepend(`<i class="listicon far fa-times-circle"></i>`);
  item.fadeOut("slow", function () {
    item.remove();
  });

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
      `<div class="ui divider"></div></div>`
  );

  //* JSON
  let rawData = fs.readFileSync("src/test.json");
  let structuredData = JSON.parse(rawData);
  //console.log(structuredData[pos]);
  structuredData[$(task).index()].text = itemText;
  fs.writeFileSync("src/test.json", JSON.stringify(structuredData, null, 2));
  editMode = 0;
}

function show_due_date(item) {
  let position = $(item).index();
  //console.log("yyyyyyyyyyyyyyyyyyyy" + position);
  let rawData = fs.readFileSync("src/test.json");
  let structuredData = JSON.parse(rawData);
  if (!structuredData[position].due_date) return;
  $("#editDate").val(
    structuredData[position].due_date.month +
      "/" +
      structuredData[position].due_date.day +
      "/" +
      structuredData[position].due_date.year +
      " " +
      structuredData[position].due_date.hour +
      ":" +
      structuredData[position].due_date.minute
  );
}

function set_due_date(item) {
  let position = $(item).index();
  let textbox = $("#editDate").val();
  if (!textbox) return;
  //console.log("yyyyyyyyyyyyyyyyyyyy" + textbox);
  let rawData = fs.readFileSync("src/test.json");
  let structuredData = JSON.parse(rawData);
  if (!structuredData[position].due_date)
    structuredData[position].due_date = {};
  structuredData[position].due_date.month = textbox[0] + textbox[1];
  structuredData[position].due_date.day = textbox[3] + textbox[4];
  structuredData[position].due_date.year = textbox[6] + textbox[7];

  structuredData[position].due_date.hour = textbox[9] + textbox[10];
  structuredData[position].due_date.minute = textbox[12] + textbox[13];
  fs.writeFileSync("src/test.json", JSON.stringify(structuredData, null, 2));
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
      <input class="editItem dueDate prompt try" id="editDate" value="" placeholder="(due date)   mm/dd/yy hh:mm"/></div>
      <button type="button" class="ui button" id="additemtest">Enter</button>
    <div class="ui divider"></div>`
  );
  $(item).children("input").val(item.text().trim());
  show_due_date(item);
  //console.log("pos still: " + pos);
}

/* function find_position(itemText) {
  let pos = -1;
  let rawData = fs.readFileSync("src/test.json");
  let structuredData = JSON.parse(rawData);
  jQuery(structuredData).each(function (i) {
    if (structuredData[i].text.trim() == itemText) {
      pos = i;
      //console.log("found at: " + pos);
      return 0;
    }
  });
  //console.log({ pos });
  fs.writeFileSync("src/test.json", JSON.stringify(structuredData, null, 2));
  if (pos == -1) console.error("Error: Could not find the item to edit");
  return pos;
}
*/

function progressbar() {
  $("#topProgressbar").progress({
    percent: (clearedTasks / totalTasks) * 100,
  });
}

function resetProgress() {
  clearedTasks = 0;
  totalTasks = nrTasks;
  progressbar();
}

$(function () {
  init_json();
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
  $(document).on("contextmenu", ".item", function () {
    //console.log("right click");
    if (!editMode) {
      var item = $(this);
      console.log("ppppppppppppp" + item.html());
      console.log($(this).html());
      edit_task($(this));
      $("#additemtest").on("click", () => {
        reset_edit_task(item, item.children("div").children("input").val());
      });
    }
  });
  $(document).on("mouseenter", ".item", function () {
    //$(this).css("text-decoration", "line-through");
    $(this).children("i").remove();
    $(this).prepend(`<i class="listicon far fa-times-circle"></i>`);
    //$(this).html(`<i class="listicon far fa-times-circle"></i>`);
    //$(this).remove();
  });
  $(document).on("mouseleave", ".item", function () {
    //$(this).css("text-decoration", "none");
    $(this).children("i").remove();
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

  //progressbar();
  //additem_json("lol");
});
