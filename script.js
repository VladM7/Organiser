/*
TODO change semantic ui button colors when in dark mode
TODO change list appearance
TODO modify ui structure
*/

var colors = [
  /*background*/
  "#FFFFFF",
  "#353B40",
  "#5E6366",
  /*text*/
  "#000000",
];
var activeMode = 0;

var isKeyPressed = {
  Enter: false,
};
document.onkeydown = (keyDownEvent) => {
  isKeyPressed[keyDownEvent.key] = true;
  if (isKeyPressed["Enter"]) {
    addtask();
    isKeyPressed[keyDownEvent.key] = false;
    isKeyPressed["Enter"] = false;
  }
};
document.onkeyup = (keyUpEvent) => {
  isKeyPressed[keyDownEvent.key] = false;
};

function addtask() {
  if ($("#newTask").val().trim() != "") {
    $(".list-group").append(
      `<div class="item"><i class="far fa-circle"></i>` +
        "\xa0\xa0\xa0\xa0" +
        $("#newTask").val() +
        `<div class="ui divider"></div></div>`
    );
    $("#newTask").val("");

    if ($(".important").is(":checked") == 1)
      $(".item").last().addClass("importantItems");
    if (activeMode == 1) {
      $(".item").last().css("color", colors[0]);
      $(".item").last().css("background-color", colors[2]);
    }
    $(".list-group-item").css("background-color", currentListColor);
    $(".importantItems").css("background-color", "#ffb0b0");
  }
}

$("#addTask").click(() => {
  addtask();
});

/*
$("#changeColor").click(() => {
  var randomColor1 = '#' + Math.floor(Math.random() * 16777215).toString(16);
  $("body").css("background-color", randomColor1);

  var randomColor2 = '#' + Math.floor(Math.random() * 16777215).toString(16);
  $(".list-group-item").css("background-color", randomColor2);
  $(".importantItems").css("background-color", "#eb5b5b");
  $("#newTask").css("background-color", randomColor2);

  currentListColor = randomColor2;
})
*/

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

$("#clearAll").click(() => {
  $(".list-group")
    .children()
    .fadeOut("normal", function () {
      $(".list-group").children().remove();
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

$(document).on("click", ".item", function () {
  //$(this).css("text-decoration", "line-through");
  $(this).children("i").remove();
  $(this).prepend(`<i class="far fa-times-circle"></i>`);
  $(this).fadeOut("slow", function () {
    $(this).remove();
  });
});
