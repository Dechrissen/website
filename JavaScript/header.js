function fillHeader() {
  // TOPWRAPPER / HEADER
  // -------------------

  // add color theme toggle
  $(".wrapper").prepend($("<div></div>").addClass("topbar"));
  //$(".topbar").append(
  //$("<button></button>").text(" / ").addClass("btn-toggle")
  //);
  //$(".btn-toggle").prepend($("<i></i>").addClass("fa fa-sun-o"));
  //$(".btn-toggle").append($("<i></i>").addClass("fa fa-moon-o"));

  // add 'logo box' div to 'topwrapper' div
  $(".topwrapper").append($("<div></div>").addClass("logo box"));

  // add my name at the top of the header
  $(".logo.box").append($("<h1></h1>").addClass("name"));
  $(".name").append(
    $("<a></a>")
      .text("derekandersen.net")
      .addClass("home-link")
      .attr("href", "/home.html")
  );

  // add tagline
  //$(".logo.box").append($("<p></p>").addClass("tagline"));
  //$(".tagline").append($("<i>/i>").text("Projects, writings, etc."));

  // add 'links box' div to 'topwrapper' div
  //$(".topwrapper").append($("<div></div>").addClass("links box"));

  // add 'social-links' ul
  //$(".links.box").append($("<ul></ul>").addClass("social-links"));

  // add GitHub
  //$(".social-links").append($("<li></li>").addClass("github"));
  //$(".github").append(
    //$("<a></a>")
      //.attr("href", "https://github.com/Dechrissen")
      //.attr("target", "_blank")
      //.text("")
      //.addClass("github-link")
  //);
  //$(".github-link").prepend($("<i></i>").addClass("fa fa-github-alt"));

  // add ko-fi
  //$(".social-links").append($("<li></li>").addClass("kofi"));
  //$(".kofi").append(
    //$("<a></a>")
      //.attr("href", "https://ko-fi.com/dechrissen")
      //.attr("target", "_blank")
      //.text("")
      //.addClass("kofi-link")
  //);
  //$(".kofi-link").prepend($("<i></i>").addClass("fa fa-coffee"));

  // TOPNAV LINKS
  // ------------
  $(".topnav").append(
    $("<a></a>").addClass("about").attr("href", "/about").text("about")
  );
  $(".topnav").append(
    $("<a></a>").addClass("blog").attr("href", "/blog").text("blog")
  );
  $(".topnav").append(
    $("<a></a>").addClass("projects").attr("href", "/projects").text("projects")
  );
  $(".topnav").append(
    $("<a></a>").addClass("links").attr("href", "/links").text("links")
  );
  $(".topnav").append(
    $("<a></a>").addClass("contact").attr("href", "/contact").text("contact")
  );

  // check current URL to determine which topnav link to assign as active (underlined)
  var pathname = window.location.pathname.split("/");
  var current = pathname[pathname.length - 1];
  var pagename = current.split(".")[0];
  switch (pagename) {
    case "about":
      $(".about").addClass("active");
      break;
    case "projects":
      $(".projects").addClass("active");
      break;
    case "blog":
      $(".blog").addClass("active");
      break;
    case "links":
      $(".links").addClass("active");
      break;
    case "contact":
      $(".contact").addClass("active");
      break;
  }
  addColorThemeToggle();
}
