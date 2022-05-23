const fs = require("fs");
const path = require("path");

const execPath = "D:/Info/Java, Electron, etc/To_Do"; //path.dirname(process.execPath); //"C:/Files/Electron/To_Do/";

function calculate_dates(offset) {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + offset);
  tomorrow.setMonth(tomorrow.getMonth() + 1);
  return (
    tomorrow.getFullYear() +
    "-" +
    tomorrow.getMonth() +
    "-" +
    tomorrow.getDate()
  );
}

function how_many_tasks_due_in_date(date, structuredData) {
  var count = 0;
  for (i in structuredData) {
    if (
      structuredData[i].due_date &&
      structuredData[i].due_date.year == date[2] + date[3] &&
      structuredData[i].due_date.month == date[5] + date[6] &&
      structuredData[i].due_date.day == date[8] + date[9]
    ) {
      count++;
    }
  }
  return count;
}

function init_d(l, d, structuredData) {
  for (i = 0; i < 7; i++) {
    d[i] = how_many_tasks_due_in_date(l[i], structuredData);
  }
}

function init_l(l) {
  for (i = 0; i < 7; i++) {
    l[i] = calculate_dates(i).replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
  }
}

window.onload = (event) => {
  let l = [],
    d = [];

  let rawData = fs.readFileSync(path.join(execPath, "/config/items.json"));
  //console.log(JSON.parse(rawData));
  let structuredData = JSON.parse(rawData);
  console.log(structuredData);

  init_l(l);
  for (i = 0; i < 7; i++) {
    console.log(
      l[i][2] + l[i][3] + " " + l[i][4] + l[i][5] + " " + l[i][8] + l[i][9]
    );
    var count = 0;
    for (j in structuredData) {
      if (
        structuredData[j].due_date &&
        structuredData[j].due_date.year == l[i][2] + l[i][3] &&
        structuredData[j].due_date.month == l[i][5] + l[i][6] &&
        structuredData[j].due_date.day == l[i][8] + l[i][9]
      ) {
        count++;
      }
      d[i] = count;
    }
  }
  console.log(d);

  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: l,
      datasets: [
        {
          label: "# of Tasks to Complete",
          data: d,
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
