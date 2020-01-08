window.ikke = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
  lastTabId = tabId;
});

var UNSAFE_HEADERS = /(User-Agent)|(Referer)|(Accept-Encoding)/; // |(Cookie)/;

var eventsHeaders = [];
var eventsUrl = "";
var photoUrlCache = {};
var lastTabId = 0;
var eventsLoaded = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("handle message", request.kind, sender, sender.tab.id);
  switch (request.kind) {
    case "get-calendar-events":
      lastTabId = sender.tab.id;
      eventsLoaded = false;
      getCalendarEvents(request.email, request.days);
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
    var url = new URL(details.url);
    for (const [k, v] of url.searchParams) {
      if (k === "key") {
        console.log("Send headers and key", v, eventsHeaders);
        chrome.tabs.sendMessage(lastTabId, {
          kind: "people-key",
          eventsHeaders: eventsHeaders,
          contactsKey: v,
        });
      }
    }
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

function getIsoDate(days) {
  var date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function getUpdatedUrl(email, daysBack, urlString) {
  var url = new URL(urlString);
  var params = url.searchParams;
  params.set('maxResults', 1000);
  params.set('maxAttendees', 12);
  params.delete('pageToken');
  params.set('timeMax', getIsoDate(30));
  params.set('timeMin', getIsoDate(-daysBack));
  var path = url.pathname.replace(/calendars\/.*\/events/, "calendars/" + email + "/events");
  var paramsString = Array.from(params.entries()).map(kv => encodeURIComponent(kv[0]) + "=" + encodeURIComponent(kv[1])).join("&");
  return url.protocol + "/" + url.hostname + path + "?" + paramsString;
}

function getCalendarEvents(email, daysBack) {
  console.log("getCalendarEvents", email, eventsLoaded);
  if (eventsLoaded) return;
  if (!eventsUrl) {
    retrySendCalendarEvents("No events URL, retrying in 1s", email);
    return;
  }
  var url = getUpdatedUrl(email, daysBack, eventsUrl);
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
reloadTab("calendar.google.com");
