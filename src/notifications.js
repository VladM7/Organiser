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
  let monthNow = today.getMonth(),
    dayNow = today.getDate(),
    yearNow = today.getFullYear(),
    hourNow = today.getHours(),
    minutesNow = today.getMinutes();
  let rawData = fs.readFileSync("src/test.json");
  let structuredData = JSON.parse(rawData);
  for (i in structuredData)
    if (
      structuredData[i].due_date &&
      date_compare(
        structuredData[i].due_date.year + 2000,
        structuredData[i].due_date.month,
        structuredData[i].due_date.day - 1,
        structuredData[i].due_date.hour,
        structuredData[i].due_date.minute,
        yearNow,
        monthNow,
        dayNow,
        hourNow,
        minutesNow
      ) &&
      structuredData[i].notif == false
    ) {
      structuredData[i].notif = true;
      ipcRenderer.send("send-notif");
    }
  fs.writeFileSync("src/test.json", JSON.stringify(structuredData, null, 2));
}
