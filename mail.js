window.ikkeMail = function() {
  function setup() {
    var email =
      getCookie("GAUSR") ||
      $("a[href$='privacypolicy']")
        .parent()
        .prev()
        .text()
        .trim();
    var token = getCookie("GMAIL_AT");

    function getCookie(key) {
      var match = new RegExp(key + ".*?=([^;]+)").exec(document.cookie);
      return match && match[1].trim();
    }

    function sendToken(token) {
      chrome.runtime.sendMessage({
        kind: "mail-action-token",
        email: email,
        token: token
      });
    }

    function extract(text, beginPattern, endPattern, callback) {
      var start = text.indexOf(beginPattern);
      if (start == -1) return;
      text = text.slice(start + beginPattern.length);
      var end = text.indexOf(endPattern);
      token = text.slice(0, end);
      if (token) callback(token);
    }

    if (email && token) {
      sendToken(token);
    } else if (!token) {
      $("script").each(function() {
        extract($(this).text(), 'GM_ACTION_TOKEN="', '"', sendToken);
      });
      $("img").each(function() {
        extract($(this).attr("src"), "?at=", "&", sendToken);
      });
    }
  }

  this.setTimeout(setup, 1);
  this.setTimeout(setup, 7000);
  this.setInterval(setup, 60000);
};
