// Get footer
var f = document.getElementsByTagName("footer");
var footer = f[0];

// Get last modified date and make string
const modified = new Date(document.lastModified);
let options = { year: "numeric", month: "long", day: "numeric" };
var my_date = modified.toLocaleString("en-GB", options);
var updated = "Updated " + my_date + ".";

// Insert copyright line and modified date into <i> within <footer>
var span_elem = document.createElement("span");
var copyright = document.createTextNode("Site by Derek Andersen. " + updated);
span_elem.appendChild(copyright);
footer.appendChild(span_elem);
