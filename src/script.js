const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

let pathName = path.join(__dirname, "saved.txt");
let currentText = "";

var colors = [
  /*background*/
  "#FFFFFF",
  "#353B40",
  "#5E6366",
  /*text*/
  "#000000",
];
// var activeMode = 0;

function init() {
  var array = fs.readFileSync(pathName).toString().split("\n");
  for (i in array) {
    addtask(array[i], 0);
    console.log(array[i]);
  }
}

const removeLines = (data, lines = []) => {
  data += "";
  return data
    .split("\n")
    .filter((val, idx) => lines.indexOf(idx) === -1)
    .join("\n");
};

/* $("#errorButton").click(() => {
  ipc.send('open-error-dialog');
}); */

/* 
prints "pong"
console.log(ipcRenderer.sendSync("synchronous-message", "ping"));

prints "pong"
ipcRenderer.on("asynchronous-reply", (_, ...args) => console.log(...args));

ipcRenderer.send("asynchronous-message", "ping"); */

function addtask(textData, appendData) {
  if (textData.trim() != "") {
    $(".list-group").append(
      `<div class="item"><i class="far fa-circle"></i>` +
        "\xa0\xa0\xa0\xa0" +
        textData +
        `<div class="ui divider"></div></div>`
    );

    /* if ($(".important").is(":checked") == 1)
      $(".item").last().addClass("importantItems");
    if (activeMode == 1) {
      $(".item").last().css("color", colors[0]);
      $(".item").last().css("background-color", colors[2]);
    }
    $(".list-group-item").css("background-color", currentListColor);
    $(".importantItems").css("background-color", "#ffb0b0"); */

    /* let enter = "";
    var data = fs.readFile(pathName);
    currentText = data;
    if (currentText == "") enter = "";
    else enter = "\n";
    fs.writeFile(pathName, currentText + enter + textData, (err) => {
      if (err) return console.log("Error creating the task");
    }); */
    if (appendData == 1) {
      fs.appendFile(pathName, "\n" + textData + "\n", function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    }
    $("#newTask").val("");
  }
}

function clearAll() {
  currentText = "";
  fs.writeFile(pathName, currentText, function (err) {
    if (err) throw err;
    console.log("Deleted all");
  });
  $(".list-group")
    .children()
    .fadeOut("normal", function () {
      $(".list-group").children().remove();
    });
}

$(function () {
  init();
  $("#addTask").on("click", () => {
    let taskText = $("#newTask").val();
    addtask(taskText, 1);
  });
  $(document).keyup(function (event) {
    if (event.which === 13) {
      addtask($("#newTask").val(), 1);
      $("#newTask").val("");
    }
  });
  $(document).on("click", ".item", function () {
    //$(this).css("text-decoration", "line-through");
    /* var fileContents = fs.readFileSync(pathName).toString().split("\n");
    var lineNumber = fileContents.indexOf(
      $(this).text().replace("\xa0", "").trim()
    ); */
    currentText = fs.readFileSync(pathName).toString();
    //console.log($(this).text().replace("\xa0", "").trim() + "  " + currentText);
    currentText = currentText.replace(
      "\n" + $(this).text().replace("\xa0", "").trim() + "\n",
      ""
    );
    fs.writeFileSync(pathName, currentText, function (err) {
      if (err) return console.log("Error deleting task");
    });

    $(this).children("i").remove();
    $(this).prepend(`<i class="far fa-times-circle"></i>`);
    $(this).fadeOut("slow", function () {
      $(this).remove();
    });
  });
  $(document).on("mouseenter", ".item", function () {
    //$(this).css("text-decoration", "line-through");

    $(this).children("i").remove();
    $(this).prepend(`<i class="far fa-times-circle"></i>`);
  });
  $(document).on("mouseleave", ".item", function () {
    //$(this).css("text-decoration", "none");

    $(this).children("i").remove();
    $(this).prepend(`<i class="far fa-circle"></i>`);
  });
  ipcRenderer.on("clear-all", (event) => {
    clearAll();
    //console.log("cleared all");
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
});
