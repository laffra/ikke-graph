var domain = window.location.hostname;

switch (domain) {
  case "mail.google.com":
    window.ikkeMail();
    break;
  case "calendar.google.com":
    window.ikkeCalendar();
    break;
}
