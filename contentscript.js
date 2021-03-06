
(function () {
  /*
  * Ikke - Calendar
  */

  if (document.location.href.endsWith("#IKKE")) return;

  window.ikke = {};

  var WEB_WORDS =
    "^utf$|^pdf$|^gif$|^jpg$|^jpeg$|^https$|^http$|^org$|^gov$|^com$|^nl$|^index$|^html$|^doc$|^uid$|^rfc$";
  var SIZE_WORDS =
    "^small$|^xl$|^tiny$|^large$|^medium$|^extralarge$";
  var EMAIL_WORDS = "^re$|^fwd$|^fw$";
  var OFFICE_WORDS =
    "^eng$|^engineering$|^roundtable$|^round$|^table$|^batch$|^scrum$|^program$|^roadmap$|^leadership$|^document$|^bootcamp$|^okr$|^erd$|^erp$|^level$|^sprint$|^hour$|^timelines$|^all hands$|^hands$|^brown bag$|^hold$|^retrospective$|^topics$|^demos$|^demo$|^recap$|^ooo$|^project$|^jam$|^workshop$|^time$|^ping$|^team$|^follow[ -]+up$|^wfh$|^drinks$|^intro$|^desk$|^talks*$|^social time$|^drinks*$|^social$|^tech$|^core$|^leads*$|^send$|^offsite$|^dnb$|^planning$|^support$|^discuss$|^discussion$|^quick$|^fast$|^catchup$|^catch$|^meet$|^greet$|^chat$|^zoom$|^lunch$|^coffee$|^office$|^dinner$|^stand$|^standup$|^meeting$|^sync$|^review$|^check$";
  var DUTCH_STOPWORDS =
    "^op$|^de$|^den$|^voor$|^aan$|^af$|^al$|^als$|^bij$|^dan$|^dat$|^die$|^dit$|^een$|^en$|^er$|^had$|^heb$|^hem$|^het$|^hij$|^hoe$|^hun$|^ik$|^in$|^is$|^je$|^kan$|^me$|^men$|^met$|^mij$|^nog$|^nu$|^of$|^ons$|^ook$|^te$|^tot$|^uit$|^van$|^was$|^wat$|^we$|^wel$|^wij$|^zal$|^ze$|^zei$|^zij$|^zo$|^zou$";
  var DATETIME_WORDS =
    "^evening$|^afternoon$|^morning$|^current$|^hours$|^week$|^quarterly$|^monthly$|^wkly$|^weekly$|^biweekly$|^daily$|^month$|^year$|^today$|^tomorrow$|^am$|^pm$|^jan$|^feb$|^mar$|^apr$|^may$|^jun jul aug$|^sep$|^oct$|^nov$|^dec$|^january$|^february$|^march$|^april$|^may$|^june$|^july$|^august$|^september$|^october$|^november$|^december$|^mon$|^tue$|^wed$|^thu$|^fri$|^sat$|^sun$|^[a-z]*day$";
  var ENGLISH_STOPWORDS =
    "^a$|^able$|^about$|^above$|^abst$|^accordance$|^according$|^accordingly$|^across$|^act$|^actually$|^added$|^adj$|^affected$|^affecting$|^affects$|^after$|^afterwards$|^again$|^against$|^ah$|^all$|^almost$|^alone$|^along$|^already$|^also$|^although$|^always$|^am$|^among$|^amongst$|^an$|^and$|^announce$|^another$|^any$|^anybody$|^anyhow$|^anymore$|^anyone$|^anything$|^anyway$|^anyways$|^anywhere$|^apparently$|^approximately$|^are$|^aren$|^arent$|^arise$|^around$|^as$|^aside$|^ask$|^asking$|^at$|^auth$|^available$|^away$|^awfully$|^b$|^back$|^be$|^became$|^because$|^become$|^becomes$|^becoming$|^been$|^before$|^beforehand$|^begin$|^beginning$|^beginnings$|^begins$|^behind$|^being$|^believe$|^below$|^beside$|^besides$|^between$|^beyond$|^biol$|^both$|^brief$|^briefly$|^but$|^by$|^c$|^ca$|^came$|^can$|^cannot$|^can't$|^cause$|^causes$|^certain$|^certainly$|^co$|^com$|^come$|^comes$|^contain$|^containing$|^contains$|^could$|^couldnt$|^d$|^date$|^did$|^didn't$|^different$|^do$|^does$|^doesn't$|^doing$|^done$|^don't$|^down$|^downwards$|^due$|^during$|^e$|^each$|^ed$|^edu$|^effect$|^eg$|^eight$|^eighty$|^either$|^else$|^elsewhere$|^end$|^ending$|^enough$|^especially$|^et$|^et-al$|^etc$|^even$|^ever$|^every$|^everybody$|^everyone$|^everything$|^everywhere$|^ex$|^except$|^f$|^far$|^few$|^ff$|^fifth$|^first$|^five$|^fix$|^followed$|^following$|^follows$|^for$|^former$|^formerly$|^forth$|^found$|^four$|^from$|^further$|^furthermore$|^g$|^gave$|^get$|^gets$|^getting$|^give$|^given$|^gives$|^giving$|^go$|^goes$|^gone$|^got$|^gotten$|^h$|^had$|^happens$|^hardly$|^has$|^hasn't$|^have$|^haven't$|^having$|^he$|^hed$|^hence$|^her$|^here$|^hereafter$|^hereby$|^herein$|^heres$|^hereupon$|^hers$|^herself$|^hes$|^hi$|^hid$|^him$|^himself$|^his$|^hither$|^home$|^how$|^howbeit$|^however$|^hundred$|^i$|^id$|^ie$|^if$|^i'll$|^im$|^immediate$|^immediately$|^importance$|^important$|^in$|^inc$|^indeed$|^index$|^information$|^instead$|^into$|^invention$|^inward$|^is$|^isn't$|^it$|^itd$|^it'll$|^its$|^itself$|^i've$|^j$|^just$|^k$|^keep	keeps$|^kept$|^kg$|^km$|^know$|^known$|^knows$|^l$|^largely$|^last$|^lately$|^later$|^latter$|^latterly$|^least$|^less$|^lest$|^let$|^lets$|^like$|^liked$|^likely$|^line$|^little$|^'ll$|^look$|^looking$|^looks$|^ltd$|^m$|^made$|^mainly$|^make$|^makes$|^many$|^may$|^maybe$|^me$|^mean$|^means$|^meantime$|^meanwhile$|^merely$|^mg$|^might$|^million$|^miss$|^ml$|^more$|^moreover$|^most$|^mostly$|^mr$|^mrs$|^much$|^mug$|^must$|^my$|^myself$|^n$|^na$|^name$|^namely$|^nay$|^nd$|^near$|^nearly$|^necessarily$|^necessary$|^need$|^needs$|^neither$|^never$|^nevertheless$|^new$|^next$|^nine$|^ninety$|^no$|^nobody$|^non$|^none$|^nonetheless$|^noone$|^nor$|^normally$|^nos$|^not$|^noted$|^nothing$|^now$|^nowhere$|^o$|^obtain$|^obtained$|^obviously$|^of$|^off$|^often$|^oh$|^ok$|^okay$|^old$|^omitted$|^on$|^once$|^one$|^ones$|^only$|^onto$|^or$|^ord$|^other$|^others$|^otherwise$|^ought$|^our$|^ours$|^ourselves$|^out$|^outside$|^over$|^overall$|^owing$|^own$|^p$|^page$|^pages$|^part$|^particular$|^particularly$|^past$|^per$|^perhaps$|^placed$|^please$|^plus$|^poorly$|^possible$|^possibly$|^potentially$|^pp$|^predominantly$|^present$|^previously$|^primarily$|^probably$|^promptly$|^proud$|^provides$|^put$|^q$|^que$|^quickly$|^quite$|^qv$|^r$|^ran$|^rather$|^rd$|^re$|^readily$|^really$|^recent$|^recently$|^ref$|^refs$|^regarding$|^regardless$|^regards$|^related$|^relatively$|^research$|^respectively$|^resulted$|^resulting$|^results$|^right$|^run$|^s$|^said$|^same$|^saw$|^say$|^saying$|^says$|^sec$|^section$|^see$|^seeing$|^seem$|^seemed$|^seeming$|^seems$|^seen$|^self$|^selves$|^sent$|^seven$|^several$|^shall$|^she$|^shed$|^she'll$|^shes$|^should$|^shouldn't$|^show$|^showed$|^shown$|^showns$|^shows$|^significant$|^significantly$|^similar$|^similarly$|^since$|^six$|^slightly$|^so$|^some$|^somebody$|^somehow$|^someone$|^somethan$|^something$|^sometime$|^sometimes$|^somewhat$|^somewhere$|^soon$|^sorry$|^specifically$|^specified$|^specify$|^specifying$|^still$|^stop$|^strongly$|^sub$|^substantially$|^successfully$|^such$|^sufficiently$|^suggest$|^sup$|^sure	t$|^take$|^taken$|^taking$|^tell$|^tends$|^th$|^than$|^thank$|^thanks$|^thanx$|^that$|^that'll$|^thats$|^that've$|^the$|^their$|^theirs$|^them$|^themselves$|^then$|^thence$|^there$|^thereafter$|^thereby$|^thered$|^therefore$|^therein$|^there'll$|^thereof$|^therere$|^theres$|^thereto$|^thereupon$|^there've$|^these$|^they$|^theyd$|^they'll$|^theyre$|^they've$|^think$|^this$|^those$|^thou$|^though$|^thoughh$|^thousand$|^throug$|^through$|^throughout$|^thru$|^thus$|^til$|^tip$|^to$|^together$|^too$|^took$|^toward$|^towards$|^tried$|^tries$|^truly$|^try$|^trying$|^ts$|^twice$|^two$|^u$|^un$|^under$|^unfortunately$|^unless$|^unlike$|^unlikely$|^until$|^unto$|^up$|^upon$|^ups$|^us$|^use$|^used$|^useful$|^usefully$|^usefulness$|^uses$|^using$|^usually$|^v$|^value$|^various$|^'ve$|^very$|^via$|^viz$|^vol$|^vols$|^vs$|^w$|^want$|^wants$|^was$|^wasnt$|^way$|^we$|^wed$|^welcome$|^we'll$|^went$|^were$|^werent$|^we've$|^what$|^whatever$|^what'll$|^whats$|^when$|^whence$|^whenever$|^where$|^whereafter$|^whereas$|^whereby$|^wherein$|^wheres$|^whereupon$|^wherever$|^whether$|^which$|^while$|^whim$|^whither$|^who$|^whod$|^whoever$|^whole$|^who'll$|^whom$|^whomever$|^whos$|^whose$|^why$|^widely$|^willing$|^wish$|^with$|^within$|^without$|^wont$|^words$|^world$|^would$|^wouldnt$|^www$|^x$|^y$|^yes$|^yet$|^you$|^youd$|^you'll$|^your$|^youre$|^yours$|^yourself$|^yourselves$|^you've$|^z$|^zero$";

  var STOPWORDS_RE = new RegExp(
    [
      WEB_WORDS,
      SIZE_WORDS,
      EMAIL_WORDS,
      OFFICE_WORDS,
      DUTCH_STOPWORDS,
      DATETIME_WORDS,
      ENGLISH_STOPWORDS
    ].join("|"),
    "i"
  );

  var WORDS_RE = new RegExp("[A-Za-z][A-Za-z][A-Za-z]+", "g");
  var CAMELCASE_RE = new RegExp("[A-Z][a-zA-Z]+");


  var userEmail = $("#xUserEmail").text();
  var currentEmail = userEmail;
  var currentSearchTopic = "";
  var emailToNode = {};
  var contactsKey = "";
  var lookupHeaders = [];
  var interestingEmails = [];
  var firstNames = {};
  var lastEventsLength = 0;

  var nameCache = {};
  var photoCache = {};
  var peopleTimer = setTimeout(function() { }, 1);


  var options = {
    CALENDAR_DAYS_BACK: 90,

    WORD_COUNT: 5,

    ALPHA_WARMUP_COUNT: 1,
    ALPHA_INITIAL: 0.2,
    ALPHA_WARMUP: 0.001,
    ALPHA_SHAKE: 0.1,
    ALPHA_DRAG: 0.01,
    ALPHA_DRAG_START: 0.01,
    ALPHA_SHAKE_INITIAL: 0.01,

    LINK_DISTANCE: 40,
    LINK_STRENGTH: 2,
    FILE_RADIUS: 30,
    RADIUS_MULTIPLIER: 4,
    LINE_WIDTH_RATIO: 1.3,

    COLLIDE_ITERATIONS: 2,
    FORCE_CENTER_X: 0.04,
    FORCE_CENTER_Y: 0.23,
    NODE_FONT_SIZE: 24,
    SPECIAL_NODE_FONT_SIZE: 28,
    IMAGE_SIZE_MINIMUM: 7,
    IMAGE_SIZE_RATIO: 1,

    FAILED_EVENTS_TIMEOUT: 10000,
    MINIMUM_MEETING_SIZE: 3,
    MINIMUM_PROJECT_COUNT: 6,
    MINIMUM_COLLABORATOR_COUNT: 9,
  };

  function showMessage(msg) {
    var x = $(window).width() / 2 - 4 * msg.length;
    $("#ikke-msg")
      .text(msg)
      .css("left", x + "px")
  }

  function debug() {
    for (arg of arguments) console.log(arg);
  }

  function showGraph(email) {
    closeGraph();
    if (!email) return;
    emailToNode = {};
    emailsToLink = {};
    firstNames = {};
    currentEmail = email;
    $("body").append(
      $("<iframe>")
        .addClass("ikke-calendar")
        .attr(
          "src",
          "https://calendar.google.com/calendar/embed?src=" + email + "#IKKE"
        ),
      $("<div>")
        .attr("id", "ikke-graph-overlay")
        .click(closeGraph)
        .addClass("ikke-graph-overlay"),
      $("<div>")
        .attr("id", "ikke-graph")
        .css("width", $(window).width() - 50)
        .css("height", $(window).height() - 50)
        .append(
          $("<div>")
            .attr("id", "ikke-title-container")
            .append(
              $("<span>")
                .addClass("ikke-title-label")
                .text("Email:"),
              $("<input>")
                .attr("id", "ikke-title-email")
                .on("change", emailChanged),
              $("<span>")
                .addClass("ikke-clear-button")
                .text("x")
                .on("click", function () {
                  $("#ikke-title-email").val(userEmail);
                  showGraph(userEmail);
                }),
              $("<span>")
                .addClass("ikke-title-label")
                .text("Filter:"),
              $("<input>")
                .attr("id", "ikke-title-filter")
                .on("change", filterChanged),
              $("<span>")
                .addClass("ikke-clear-button")
                .text("x")
                .on("click", function () {
                  $("#ikke-title-filter").val("");
                  filterChanged();
                }),
              $("<button>")
                .attr("id", "ikke-load-button")
                .on("click", reload)
                .text("Go"),
            ),
          $("<div>")
            .attr("id", "ikke-msg")
            .css("top", ($(window).height() / 2 - 75) + "px")
            .css("left", ($(window).width() / 2 - 25) + "px"),
          $("<button>")
            .addClass("ikke-close-button")
            .on("click", closeGraph)
            .text("x"),
          $("<div>")
            .addClass("ikke-sidebar")
            .css("height", $(window).height() - 240)
            .append(
              $("<div>")
                .addClass("ikke-projects")
                .text("Main Projects, Teams, and Focus:"),
              $("<div>")
                .attr("id", "ikke-files")
                .text("Important Files:")
                .addClass("ikke-files"),
            ),
          $("<div>")
            .addClass("ikke-zoom-buttons")
            .append(
              $("<button>")
                .attr("id", "ikke-zoom-in-button")
                .on("click", function () {
                  zoom.scaleTo(svg, (currentZoomScale *= 1.3));
                })
                .text("+"),
              $("<button>")
                .attr("id", "ikke-zoom-out-button")
                .on("click", function () {
                  zoom.scaleTo(svg, (currentZoomScale *= 0.7));
                })
                .text("-"),
              $("<div>")
                .addClass("ikke-options")
            ),
        ),
    );
    addGraphOptions();
    showMessage("Loading");
    $(".ikke-sidebar").css("visibility", "hidden");
    setTitle("", email);
    getCalendarEvents(email);
  }

  function getCalendarEvents(email) {
    setTimeout(() => {
      if (email === currentEmail && $("#ikke-msg").text() === "Loading") {
        showMessage("Could not load calendar events. Please try again.");
      }
    }, options.FAILED_EVENTS_TIMEOUT);
    chrome.runtime.sendMessage({
      kind: "get-calendar-events",
      email: email,
      days: options.CALENDAR_DAYS_BACK,
    });
    chrome.runtime.sendMessage(
      {
        kind: "get-mail-action-token",
        email: userEmail
      },
      function(response) {
        if (response) {
          mailActionToken = response.token;
        }
      }
    );
  }

  const addGraphOptions = () => {
    Object.keys(options).map(option => {
      var value = options[option];
      $(".ikke-options")
        .append($("<div>")
          .addClass("ikke-option")
          .append(
            $("<input>")
              .addClass("ikke-option-value")
              .attr("type", "text")
              .attr("min", 0)
              .attr("max", 10 * value)
              .attr("value", value)
              .text(value)
              .change(function() {
                options[option] = this.value;
                closeGraph();
                showGraph(userEmail);
              }),
            $("<div>")
              .addClass("ikke-option-name")
              .text(option)));
    });
  }

  $(document).keyup(function(e) {
    if ($("#ikke-graph").length) {
      switch (e.keyCode) {
        case 27: // escape
          closeGraph();
          break;
      }
      return false;
    }
  });

  function closeGraph() {
    $(".ikke-calendar").remove();
    $("#ikke-graph-overlay").remove();
    $("#ikke-graph").remove();
  }

  function setupGraph() {
    if ($("#ikke-button").length == 0) {
      $("body").append(
        $("<span>")
          .attr("id", "ikke-button")
          .click(function() {
            currentSearchTopic = "";
            showGraph(userEmail);
          })
          .text("Ikke Work Graph")
      );
    }
    $("#ikke-button").css("left", $(window).width() / 2 - 10 + "px");
    $("#ikke-graph")
      .css("width", $(window).width() - 50)
      .css("height", $(window).height() - 50);
    closeGraph();
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    debug("Handle message " + request.kind);
    switch (request.kind) {
      case "calendar-events":
        if (request.events.length == lastEventsLength) {
          lastEventsLength = 0;
          reload();
          break;
        }
        lastEventsLength = request.events.length;
        debug("Handle " + lastEventsLength + " events for " + request.email, request);
        if (request.email === currentEmail) {
          convertToGraph(request.events, currentEmail);
        } else {
          setTimeout(function () { showGraph(currentEmail); }, 1000);
        }
        break;
      case "calendar-error":
        showMessage("An error occurred: " + request.error);
        break;
      case "people-key":
        contactsKey = request.contactsKey;
        eventsHeaders = request.eventsHeaders;
        break;
      case "lookup-headers":
        lookupHeaders = request.lookupHeaders;
        console.log("Got lookup headers", lookupHeaders);
        break;
      case "calendar-contacts-key":
        contactsKey = request.key;
        eventsHeaders = request.headers;
        break;
    }
  });

  function getNameKey(email) {
    return "ikke-name-" + email;
  }

  function addToNameCache(email, name) {
    nameCache[email] = name;
    localStorage.setItem(getNameKey(email), name);
    console.log("Cache name for " + email + " = " + nameCache[email]);
  }

  function getName(email) {
    console.log("Name for " + email + " = " + nameCache[email]);
    var name = nameCache[email];
    if (name) {
      return name;
    }
    name = localStorage.getItem(getNameKey(email));
    if (name) {
      return name;
    }
    return email;
  }

  function getPhotoKey(email) {
    return "ikke-photo-" + email;
  }

  function addToPhotoCache(email, url) {
    photoCache[email] = url;
    localStorage.setItem(getPhotoKey(email), url);
  }

  function getPhotoUrl(email) {
    var url = photoCache[email];
    if (url) {
      return url;
    }
    url = localStorage.getItem(getPhotoKey(email));
    if (url) {
      addToPhotoCache(email, url);
      return url;
    }
    return "https://dkfb5wtlvnx1t.cloudfront.net/default-placeholder.png";
  }

  function findPeople() {
    if (window.location.hostname === "calendar.google.com") {
      $("div[role='treeitem']").each(function () {
        var person = $(this);
        var id = person.data("id");
        if (!id) return;
        var email = id.split("/")[0];
        if (email.indexOf("@") == -1) return;
        var labelParts = person.attr("aria-label").split(", ");
        if (labelParts.length > 1) {
          addToNameCache(email, labelParts[0]);
          person.find("div[style!=''][style]").each(function () {
            var image = $(this).css("background-image");
            if (image !== "none") {
              addToPhotoCache(email, image.slice(5, -2)); // strip url(..)
            }
          })
        }
      });
    }
    if (window.location.hostname === "contacts.google.com") {
      $("div[data-email!='']").each(function () {
        var card = $(this);
        var email = card.data("email");
        var url = card.find("img").attr("src");
        var job = card.find("div[aria-label='Job and Organization']").text();
        if (email && job && url) {
          addToPhotoCache(email, url);
        }
      })
    }
  }

  document.body.addEventListener('DOMSubtreeModified', function () {
    clearTimeout(peopleTimer);
    peopleTimer = setTimeout(findPeople, 100);
  });

  function emailChanged() {
    currentSearchTopic = ""
    showGraph($("#ikke-title-email").val());
  }

  function reload() {
    filterChanged();
  }

  function filterChanged() {
    currentSearchTopic = $("#ikke-title-filter").val();
    showGraph($("#ikke-title-email").val());
  }

  function setTitle(name, email) {
    $("#ikke-title-email").val(email);
    $("#ikke-title-filter").val(currentSearchTopic);
  }

  function convertToGraph(events, email) {
    var links = [];
    var files = {};

    if (!events) return [];

    function getUniqueAttendee(attendee) {
      var node = emailToNode[attendee.email];
      if (!node) node = emailToNode[attendee.email] = attendee;
      if (attendee.displayName) {
        firstNames[attendee.displayName.split(" ")[0]] = true;
        if (attendee.email === currentEmail) {
          setTitle(attendee.displayName, currentEmail);
        }
      }
      node.words = node.words || {};
      node.count = node.count || 0;
      return node;
    }

    function getUniqueLink(source, target) {
      var emails = [source.email, target.email].sort();
      var key = emails[0] + "_" + emails[1];
      var link = emailsToLink[key];
      if (!link) {
        link = { source: source, target: target, value: 0 };
        links.push(link);
      }
      return link;
    }

    function isAttendingPerson(attendee) {
      if (attendee.resource) {
        return false;
      }
      if (attendee.responseStatus === "declined") {
        return false;
      }
      return true;
    }

    function isValuableMeeting(event) {
      if (event.attendees) {
        event.attendees = event.attendees.filter(isAttendingPerson);
        if (!event.attendeesOmitted) {
          if (event.attendees.length >= options.MINIMUM_MEETING_SIZE) return true; // avoid small meetingavoid small meetings
          if (event.attachments) return true; // attachments are always interesting
        }
      }
      return false;
    }

    events = events.filter(isValuableMeeting);

    if (currentSearchTopic) {
      var regex = new RegExp(currentSearchTopic, "i");
      events = events.filter(event => {
        return event.summary && event.summary.match(regex) || JSON.stringify(event.attendees).match(regex);
      })
    }

    events.forEach(function(event) {
      function addWords(attendee) {
        if (event.summary) {
          var node = getUniqueAttendee(attendee);
          getWords(event.summary).forEach(function(word) {
            node.words[word] = (node.words[word] || 0) + 1;
          });
        }
      }

      event.creator.responseStatus = "accepted";
      event.attendees.push(event.creator);
      event.attendees.map(addWords);
      for (var i = 0; i < event.attendees.length - 1; i++) {
        var source = getUniqueAttendee(event.attendees[i]);
        for (var j = i + 1; j < event.attendees.length; j++) {
          var target = getUniqueAttendee(event.attendees[i]);
          if (!source.resource && !target.resource) {
            getUniqueLink(source, target).value += 1;
            source.attachments = target.attachments = event.attachments;
          }
        }
      }
      if (event.attachments) {
        event.attachments.forEach(function(attachment) {
          files[attachment.fileUrl] = attachment;
          attachment.emails = (event.attendees || []).map(attendee => attendee.email);
        });
      }
    });

    if (links.length > 0) {
      showMessage("Rendering");
      setTimeout(function () {
        renderGraph(links, files, email);
      }, 1);
    } else {
      const reason = currentSearchTopic ? "Try another search filter." : "Calendar appears private...";
      showMessage("No matching events found. " + reason);
    }
  }

  var zoom = d3
    .zoom()
    .scaleExtent([0.3, 2]);

  var svg = null;
  var currentZoomScale = 0.9;

  function renderGraph(links, files, email) {
    var w = $("#ikke-graph").width();
    var h = $("#ikke-graph").height();

    var nodes = [];
    var topicLinks = [];

    function shorten(title) {
      if (title.length < 13) return title;
      return title.slice(0, 8) + "..." + title.slice(title.length - 8);
    }

    function convertLinksToNodes() {
      links.forEach(function(link) {
        emailToNode[link.source.email].count += 1;
        emailToNode[link.target.email].count += 1;
      });
      nodes = d3.values(emailToNode);
      var people = nodes.filter(node => !node.isFile && !node.is && (node.count > options.MINIMUM_COLLABORATOR_COUNT || node.attachments));
      var minCount = people.length < 10 ? 0 : options.MINIMUM_COLLABORATOR_COUNT;
      debug("Found " + people.length + " people. minCount: " + minCount, people);
      nodes = nodes.filter(node => {
        const interesting = node.isFile || node.isTopic || node.count > minCount || node.attachments;
        if (interesting) interestingEmails.push(node.email);
        return interesting;
      });
    }

    function addFiles() {
      Object.values(files)
        .sort((file1, file2) => file2.emails.length - file1.emails.length)
        .map(file => {
          $("#ikke-files").append(
            $("<div>")
              .addClass("ikke-file")
              .attr("emails", JSON.stringify(file.emails))
              .on("mouseover", function () {
                $(this).css("background", "#EEE");
                JSON.parse($(this).attr("emails")).filter(email => email !== currentEmail).map(email => {
                  var circle = $("#ikke-node-" + email.split("@")[0]).find("circle");
                  circle
                    .attr("r", parseFloat(circle.attr("_r")) + 9)
                    .attr("fill", "orange");
                });
              })
              .on("mouseout", function () {
                $(this).css("background", "")
                JSON.parse($(this).attr("emails")).filter(email => email !== currentEmail).map(email => {
                  var circle = $("#ikke-node-" + email.split("@")[0]).find("circle");
                  circle
                    .attr("r", circle.attr("_r"))
                    .attr("fill", circle.attr("_fill"));
                });
              })
              .append(
                $("<img>")
                  .attr("src", file.iconLink),
                $("<a>")
                  .attr("href", file.fileUrl)
                  .attr("target", "_blank")
                  .text(file.title)
              )
          );
        });
    }

    function annotateNodes() {
      nodes.forEach(function(node, index) {
        node.name = node.displayName || getName(node.email) || node.email || node.id || JSON.stringify(node);
        node.fontSize = options.NODE_FONT_SIZE;
      });
    }

    function colorSpecialNodes() {
      nodes.forEach(function(node) {
        if (node.email === email) {
          node.color = "red";
          node.fill = "orange";
          node.fontSize = options.SPECIAL_NODE_FONT_SIZE;
          node.fixed = true;
        }
      });
    }

    function addDetails() {
      nodes.forEach(function(node) {
        node.radius = options.IMAGE_SIZE_MINIMUM + options.IMAGE_SIZE_RATIO * Math.sqrt(node.count);
        node.opacity = 1;
        node.fill = "#DDD";
        node.color = "#333";
        node.x = w / 2;
        node.y = h / 2;
        node.image = node.photo || getPhotoUrl(node.email, contactsKey, lookupHeaders);
      });
    }

    function addTopics() {
      var topicNodes = {};
      var firstNameRegex = new RegExp(
        "^" + d3.keys(firstNames).join("$|^") + "$",
        "i"
      );
      nodes.forEach(function(node) {
        node.x = w / 2;
        node.y = h / 2;
        if (!node.words) return;
        var words = Object.keys(node.words)
          .filter(word => !firstNameRegex.exec(word))
          .sort(function(a, b) {
            return node.words[b] - node.words[a];
          });
        words.splice(options.WORD_COUNT);
        words.forEach(function(word, index) {
          if (!topicNodes[word]) {
            topicNodes[word] = {
              email: word,
              name: word,
              isTopic: true,
              color: "red",
              fill: "red",
              fontSize: 32,
              linkColor: "#333",
              radius: 20,
              opacity: 0.1,
              count: 0,
              x: w / 2,
              y: h / 2
            };
          }
          topicNodes[word].count += 1;
          if (topicNodes[word].count > 4) {
            topicNodes[word].linkColor = randomColor();
          }
          topicLinks.push({
            source: topicNodes[word],
            target: node
          });
        });
      });
      nodes = nodes.concat(d3.values(topicNodes));
    }

    function addProjects() {
      projects = nodes
        .filter(node => node.isTopic && node.count >= options.MINIMUM_PROJECT_COUNT && node.name.match(/^[A-Z]/))
        .sort((p1, p2) => p2.count - p1.count)
        .slice(0, 10);
      projects.map((project) => {
        $(".ikke-projects")
          .append($("<div>")
            .addClass("ikke-project")
            .text("👥 " + project.email)
            .on("mouseover", function () {
              $(this).css("background", "#EEE");
              $(".ikke-node text:contains('" + project.email + "')").animate({ "font-size": "30pt"}, 500);
            })
            .on("mouseout", function () {
              $(this).css("background", "")
              $(".ikke-node text:contains('" + project.email + "')").animate({ "font-size": "20pt"}, 500);
            })
            .on("click", function () {
              currentSearchTopic = project.email;
              showGraph($("#ikke-title-email").val());
            })
          );
      });
    }

    convertLinksToNodes();
    addDetails();
    addTopics();
    addProjects();
    addFiles();
    annotateNodes();
    colorSpecialNodes();

    var force = d3
      .forceSimulation()
      .nodes(nodes)
      .on("tick", tick);

    svg = d3
      .select("#ikke-graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .style("cursor", "move")
      .call(zoom);


    showMessage(nodes.length > 0 ? "" : "No meetings found that collaborators.");

    $(".ikke-sidebar").css("visibility", "visible");

    var g = svg.append("g");

    zoom.on("zoom", function (a, b, c) {
      currentZoomScale = d3.event.transform.k;
      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      g.attr("transform", d3.event.transform);
    });

    svg
      .insert("rect", ":first-child")
      .attr("fill", "white")
      .attr("width", w)
      .attr("height", h)
      .on("click", shake);

    var link = g
      .selectAll(".link")
      .data(topicLinks)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke-opacity", 0.1)
      .style("stroke-width", function(l) {
        return Math.max(2, l.source.count * options.LINE_WIDTH_RATIO *  Math.log(l.source.count));
      })
      .style("stroke", function(l) {
        return l.source.linkColor || "grey";
      });

    var node = g
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .style("pointer-events", "stroke")
      .attr("id", function(d) {
        return "ikke-node-" + d.email.split("@")[0];
      })
      .attr("class", "ikke-node")
      .attr("cursor", "pointer")
      .raise()
      .style("pointer-events", "visible")
      .on("click", clickNode)
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    node
      .append("svg:circle")
      .attr("r", function(d) {
        return d.isTopic ? 1 : 2 + d.radius + (d.email === email ? 5 : 0);
      })
      .attr("_r", function(d) {
        return d.isTopic ? 1 : 2 + d.radius + (d.email === email ? 5 : 0);
      })
      .attr("opacity", function(d) {
        return d.opacity;
      })
      .attr("fill", function(d) {
        return d.fill;
      })
      .attr("_fill", function(d) {
        return d.fill;
      });

    nodes.forEach(function(node) {
      svg
        .append("clipPath")
        .attr("id", "clipCircle" + node.radius)
        .append("circle")
        .attr("r", node.radius || 30);
    });

    function setAlternatePhoto(d) {
      d3.select(this).attr(
        "xlink:href",
        "https://dkfb5wtlvnx1t.cloudfront.net/default-placeholder.png"
      );
    }

    node
      .append("svg:image")
      .attr("xlink:href", function(d) {
        return d.image;
      })
      .attr("id", function(d) {
        return "photo-" + d.email;
      })
      .attr("x", function(d) {
        return -d.radius;
      })
      .attr("y", function(d) {
        return -d.radius;
      })
      .attr("width", function(d) {
        return 2 * d.radius;
      })
      .attr("height", function(d) {
        return 2 * d.radius;
      })
      .attr("clip-path", function(d) {
        return "url(#clipCircle" + d.radius + ")";
      })
      .on("error", setAlternatePhoto);

    node
      .append("text")
      .attr("y", function(d) {
        return d.isTopic ? -4 : d.radius + 7;
      })
      .style("font-size", function(d) {
        return d.fontSize;
      })
      .style("fill", function(d) {
        return d.color;
      })
      .text(function(d) {
        return d.name;
      })
      .style("text-anchor", "middle");

    node
      .append("text")
      .attr("y", function(d) {
        return d.radius + d.fontSize - 3;
      })
      .style("font-size", function(d) {
        return d.fontSize;
      })
      .style("fill", function(d) {
        return d.color;
      })
      .text(function(d) {
        return d.lastName;
      })
      .style("text-anchor", "middle");

    function tick() {
      if (link) {
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
      }

      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    function dragstarted(d) {
      d.fx = d.x;
      d.fy = d.y;
      shake(options.ALPHA_DRAG_START);
    }

    function dragged(d) {
      d.fx = d.cx = d3.event.x;
      d.fy = d.cy = d3.event.y;
      shake(options.ALPHA_DRAG);
    }

    function dragended(d) {
      shake();
    }

    function clickNode(d) {
      if (d.url) {
        window.open(d.url);
      } else if (d.isTopic) {
        currentSearchTopic = d.name;
        showGraph($("#ikke-title-email").val());
      } else if (d.email) {
        currentSearchTopic = ""
        showGraph(d.email);
      }
    }

    function shake(alpha) {
      force.alpha(alpha || options.ALPHA_SHAKE).restart();
    }

    function layout(alpha) {
      force
        .force(
          "collide",
          d3
            .forceCollide()
            .radius(function(d) {
              return d.isFile ? options.FILE_RADIUS : options.RADIUS_MULTIPLIER * d.radius;
            })
            .iterations(options.COLLIDE_ITERATIONS)
        )
        .force("x", d3.forceX(w * 2 / 5).strength(options.FORCE_CENTER_X))
        .force("y", d3.forceY(h / 2).strength(options.FORCE_CENTER_Y));
      d3.range(options.ALPHA_WARMUP_COUNT).forEach(function() {
        force.alpha(alpha);
        while (force.alpha() > options.ALPHA_WARMUP) {
          force.tick();
        }
      });
    }

    function setInitialZoomScale() {
      var minX = 0,
        maxX = w,
        minY = 0,
        maxY = h;
      nodes.forEach(function(node) {
        minX = Math.min(minX, node.x - node.radius);
        maxX = Math.max(maxX, node.x + node.radius);
        minY = Math.min(minY, node.y - node.radius);
        maxY = Math.max(maxY, node.y + node.radius);
      });
      currentZoomScale = Math.min(
        (w - 150) / (maxX - minX),
        (h - 150) / (maxY - minY)
      );
      zoom.scaleTo(svg, currentZoomScale);
    }

    function layoutAll() {
      force.force(
        "link",
        d3
          .forceLink(topicLinks)
          .distance(options.LINK_DISTANCE)
          .strength(options.LINK_STRENGTH)
      );
      nodes.forEach(function(node) {
        delete node.fx;
        delete node.fy;
      });
      layout(options.ALPHA_INITIAL);
      setInitialZoomScale();
      layout(options.ALPHA_INITIAL);
    }
    layoutAll();

    shake(options.ALPHA_SHAKE_INITIAL);
  }

  function setInitialZoomScale() {
    var minX = 0,
      maxX = w,
      minY = 0,
      maxY = h;
    nodes.forEach(function(node) {
      minX = Math.min(minX, node.x - node.radius);
      maxX = Math.max(maxX, node.x + node.radius);
      minY = Math.min(minY, node.y - node.radius);
      maxY = Math.max(maxY, node.y + node.radius);
    });
    currentZoomScale = Math.min(
      (w - 50) / (maxX - minX),
      (h - 50) / (maxY - minY)
    );
    zoom.scaleTo(svg, currentZoomScale);
  }

  randomColor = (function() {
    var index = -1;
    var colors = [
      "#0c7c07",
      "#c70e18",
      "#333333",
      "#955d28",
      "#1f4bfc",
      "#222292",
      "#922222",
      "#929222",
      "#229222",
      "#ae1ab6",
      "#568ff8"
    ];
    return function() {
      index = (index + 1) % colors.length;
      return colors[index];
    };
  })();

  function getWords(s) {
    var words = s.match(WORDS_RE) || [];
    var uniqueWords = {};
    words = words
      .filter(function (word) {
        if (uniqueWords[word]) return false;
        uniqueWords[word] = word;
        return !word.match(STOPWORDS_RE);
      })
      .map(function (word) {
        if (word.match(CAMELCASE_RE)) {
          return (word.charAt(0).toUpperCase() + word.slice(1)).trim();
        }
      });
    if (words.length < 4) {
      joined = words.join(" ").trim();
      return joined.length ? [joined] : [];
    }
    return [];
  }

  if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
  };

  console.log("Ikke running", window.location.hostname);
  if (window.location.hostname === "calendar.google.com") {
    $(window).resize(setupGraph);
    setupGraph();
  }
})();