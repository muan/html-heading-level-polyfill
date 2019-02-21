// Default level is 1
// Each parent sectioning element adds an extra heading level
function determineLevel(el) {
  let level = 1;
  while (el.parentNode && (el = el.parentNode.closest("article,aside,nav,section,blockquote,details,dialog,fieldset,figure,td"))) {
    level += 1;
  }
  return level;
}

// - If inside of <hgroup>, remove sementics
// - If is <hgroup> or to <h1>, assign new level according to sectioning parents
function adjustHeading(heading) {
  let type = heading.localName,
      parent = heading.parentNode;
  if ((type === "h1" ||
       type === "h2" ||
       type === "h3" ||
       type === "h4" ||
       type === "h5" ||
       type === "h6") &&
      parent !== null && parent.localName === "hgroup") {
    heading.setAttribute("role", "presentation");
    heading.removeAttribute("aria-level");
  } else if (type === "hgroup" || type === "h1") {
    heading.setAttribute("aria-level", determineLevel(heading));
    if (type === "hgroup") {
      heading.setAttribute("role", "heading");
    }
  }
}

// Get all heading elements and apply new heading level if necessary
function traverseAndAdjustHeadings(doc) {
  doc.querySelectorAll("hgroup,h1,h2,h3,h4,h5,h6").forEach(heading => {
    adjustHeading(heading);
  })
}

// Initialize and observe
function initiateHeadingPolyfill(doc) {
  traverseAndAdjustHeadings(doc);
  (new MutationObserver(() => traverseAndAdjustHeadings(doc))).observe(doc, { childList: true, subtree: true });
}

initiateHeadingPolyfill(document);
