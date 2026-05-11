const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (!header) return;
  header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
});
