function setActiveNavbarLink() {

  // add color theme toggle
  //$(".wrapper").prepend($("<div></div>").addClass("topbar"));
  //$(".topbar").append(
  //$("<button></button>").text(" / ").addClass("btn-toggle")
  //);
  //$(".btn-toggle").prepend($("<i></i>").addClass("fa fa-sun-o"));
  //$(".btn-toggle").append($("<i></i>").addClass("fa fa-moon-o"));

  // check current URL to determine which navbar link to assign as active (bold)
  var pathname = window.location.pathname.split("/").filter(Boolean);

  if (pathname.length === 1) {
    // top-level main pages
    var pagename = pathname[0];
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
  } else if (pathname.length === 3 && pathname[0] === "blog" && pathname[1] === "tag") {
    // tag routes like /blog/tag/sometag
    $(".blog").addClass("active");
  }

  //addColorThemeToggle();
}
