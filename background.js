window.ikke = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
  lastTabId = tabId;
});

var UNSAFE_HEADERS = /(User-Agent)|(Referer)|(Accept-Encoding)|(Cookie)/;

var mailActionTokens = {};
var eventsHeaders = [];
var eventsUrl = "";
var lastTabId = 0;
var eventsLoaded = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.kind) {
    case "mail-action-token":
      mailActionTokens[request.email] = request.token;
      break;
    case "get-mail-action-token":
      sendResponse({ token: mailActionTokens[request.email] });
      break;
    case "get-calendar-events":
      eventsLoaded = false;
      sendCalendarEvents(request.email);
      break;
  }
});

function safeHeaders(unsafeHeaders) {
    var headers = {};
    unsafeHeaders.forEach(function(header) {
      if (!header.name.match(UNSAFE_HEADERS)) {
        headers[header.name] = header.value;
      }
    });
    return headers;
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    eventsHeaders = safeHeaders(details.requestHeaders);
    eventsUrl = details.url;
    if (details.tabId > 0) {
      lastTabId = details.tabId;
    }
  },
  { urls: ["https://*.google.com/calendar/v3/calendars/*"] },
  ["requestHeaders"]
);

function sendError(msg, retry) {
  console.log("Sending error:", msg);
  chrome.tabs.sendMessage(0, {
    kind: "calendar-error",
    error: msg,
    retry: retry ? true : false,
  });
}

function sendCalendarEvents(email) {
  if (eventsLoaded) return;
  function retry(message, delay) {
    console.log(message);
    setTimeout(function () { sendCalendarEvents(email); }, delay || 1);
  }
  if (!eventsUrl) {
    retry("No events URL, retrying in 1s", 1000);
    return;
  }
  var now = new Date();
  now.setDate(now.getDate() + 30);
  var max = now.toISOString();
  now.setDate(now.getDate() - 60);
  var min = now.toISOString();
  var url = eventsUrl
    .replace(/calendars\/.*\/events/, "calendars/" + email + "/events")
    .replace('maxResults=250&', 'maxResults=1000&')
    .replace('maxAttendees=1&', 'maxAttendees=12&timeMin=' + min + '&' + 'timeMax=' + max + '&');
  $.ajax({
    url: url,
    headers: eventsHeaders,
    success: function (response) {
      if (!response.items) return; sendError("Could not load any events", true);
      if (response.summary.indexOf("@") !== -1 && response.summary !== email) {
        return retry("Old response: " + email + " " + response.summary + " - retrying");
      }
      try {
        chrome.tabs.sendMessage(lastTabId, {
          kind: "calendar-events",
          email: response.summary,
          events: response.items,
          headers: eventsHeaders
        });
        eventsLoaded = true;
      } catch (e) {
        sendError(e.message);
      }
    }
  });
}

function reloadTab(domain) {
  chrome.tabs.query({ url: "https://" + domain + "/*" }, function(tabs) {
    tabs.map(function(tab) {
      chrome.tabs.reload(tab.id);
    });
  });
}
reloadTab("mail.google.com");
reloadTab("calendar.google.com");
