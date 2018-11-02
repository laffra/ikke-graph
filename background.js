window.ikke = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
});

var UNSAFE_HEADERS = /(User-Agent)|(Referer)|(Accept-Encoding)|(Cookie)/;

var mailActionTokens = {};
var eventsHeaders = [];
var eventsUrl = "";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.kind) {
    case "mail-action-token":
      mailActionTokens[request.email] = request.token;
      break;
    case "get-mail-action-token":
      sendResponse({ token: mailActionTokens[request.email] });
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
  function(details) {
    eventsHeaders = safeHeaders(details.requestHeaders);
    eventsUrl = details.url;
    chrome.tabs.sendMessage(details.tabId, {
      kind: "calendar-events-url",
      url: details.url,
      headers: eventsHeaders
    });
  },
  { urls: ["https://*.google.com/calendar/v3/calendars/*"] },
  ["requestHeaders"]
);

function reloadTab(domain) {
  chrome.tabs.query({ url: "https://" + domain + "/*" }, function(tabs) {
    tabs.map(function(tab) {
      chrome.tabs.reload(tab.id);
    });
  });
}
reloadTab("mail.google.com");
reloadTab("calendar.google.com");
