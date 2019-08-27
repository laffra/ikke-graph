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
  console.log("handle message", request.kind, sender, sender.tab.id);
  switch (request.kind) {
    case "mail-action-token":
      mailActionTokens[request.email] = request.token;
      break;
    case "get-mail-action-token":
      sendResponse({ token: mailActionTokens[request.email] });
      break;
    case "get-calendar-events":
      lastTabId = sender.tab.id;
      eventsLoaded = false;
      getCalendarEvents(request.email);
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
  chrome.tabs.sendMessage(lastTabId, {
    kind: "calendar-error",
    error: msg,
    retry: retry ? true : false,
  });
}

function retrySendCalendarEvents(message, email) {
  console.log(message);
  setTimeout(function () { getCalendarEvents(email); }, 1000);
}

function getCalendarEvents(email) {
  console.log("getCalendarEvents", email, eventsLoaded);
  if (eventsLoaded) return;
  if (!eventsUrl) {
    retrySendCalendarEvents("No events URL, retrying in 1s", email);
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
    .replace('maxAttendees=1&', 'maxAttendees=12&')
    .replace(/pageToken=.*/, '')
    .replace(/timeMax=[^&]*&/, 'timeMax=' + max + '&');
  console.log("Get calendar events for", email);
  url.split("&").map(s => console.log("   " + s));
  $.ajax({
    url: url,
    headers: eventsHeaders,
    success: function (response) {
      if (!response.items) {
        sendError("Could not load any events", true);
      } else {
        if (response.summary.indexOf("@") !== -1 && response.summary !== email) {
          retrySendCalendarEvents("Bad response. " + response.items.length + " events. Expected: " + email + ". Instead got: " + response.summary, email);
        } else {
          try {
            console.log("Send", response.items.length, "events for", email, "to tab", lastTabId);
            console.log("url=", url);
            chrome.tabs.sendMessage(lastTabId, {
              kind: "calendar-events",
              email: email,
              events: response.items,
              headers: eventsHeaders
            });
            eventsLoaded = true;
          } catch (e) {
            sendError(e.message);
          }
        }
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
