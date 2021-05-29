var currentListColor = "#FFFFFF";

var isKeyPressed = {
  'Enter': false
}
document.onkeydown = (keyDownEvent) => {
  isKeyPressed[keyDownEvent.key] = true;
  if (isKeyPressed["Enter"]) {
    addtask();
    isKeyPressed[keyDownEvent.key] = false;
  }
}
document.onkeyup = (keyUpEvent) => {
  isKeyPressed[keyDownEvent.key] = false;
}

function addtask() {
  if ($("#newTask").val() != "") {
    $(".list-group").append(`<li class="list-group-item"><i class="far fa-circle"></i>` + "\xa0\xa0\xa0\xa0" + $("#newTask").val() + `</li>`);
    $("#newTask").val("");

    if ($('.important').is(':checked') == 1)
      $("li").last().addClass("importantItems");

    $(".list-group-item").css("background-color", currentListColor);
    $(".importantItems").css("background-color", "#ffb0b0");
  }
}

$("#addTask").click(() => {
  addtask();
})

$("#changeColor").click(() => {
  var randomColor1 = '#' + Math.floor(Math.random() * 16777215).toString(16);
  $("body").css("background-color", randomColor1);

  var randomColor2 = '#' + Math.floor(Math.random() * 16777215).toString(16);
  $(".list-group-item").css("background-color", randomColor2);
  $(".importantItems").css("background-color", "#eb5b5b");
  $("#newTask").css("background-color", randomColor2);

  currentListColor = randomColor2;
})

$("#clearAll").click(() => {
  $("#list").children().fadeOut("normal", function () {
    $("#list").children().remove();
  });
})


$(document).on('mouseenter', 'li', function () {
  //$(this).css("text-decoration", "line-through");

  $(this).children().remove();
  $(this).prepend(`<i class="far fa-times-circle"></i>`);
});
$(document).on('mouseleave', 'li', function () {
  //$(this).css("text-decoration", "none");

  $(this).children().remove();
  $(this).prepend(`<i class="far fa-circle"></i>`);
});


$(document).on('click', 'li', function () {
  //$(this).css("text-decoration", "line-through");
  $(this).children().remove();
  $(this).prepend(`<i class="far fa-times-circle"></i>`);
  $(this).fadeOut("slow", function () {
    $(this).remove();
  });
});