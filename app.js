const pages = [...document.querySelectorAll(".page")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const progress = document.querySelector(".page-progress span");
const currentLabel = document.querySelector(".page-controls span b");
const prevButton = document.querySelector(".prev-page");
const nextButton = document.querySelector(".next-page");
const menuToggle = document.querySelector(".menu-toggle");
const pageNav = document.querySelector(".page-nav");

let activePage = 1;

function showPage(pageNumber, updateHash = true) {
  const nextPage = Math.min(pages.length, Math.max(1, Number(pageNumber) || 1));
  activePage = nextPage;
  pages.forEach((page, index) => {
    const active = index === nextPage - 1;
    if (!active && page.contains(document.activeElement)) document.activeElement.blur();
    page.classList.toggle("is-current", active);
    page.setAttribute("aria-hidden", String(!active));
    page.inert = !active;
  });
  navLinks.forEach((link) => {
    const active = Number(link.dataset.page) === nextPage;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  currentLabel.textContent = String(nextPage).padStart(2, "0");
  progress.style.width = `${(nextPage / pages.length) * 100}%`;
  prevButton.disabled = nextPage === 1;
  nextButton.disabled = nextPage === pages.length;
  document.title = `${pages[nextPage - 1].dataset.title} · 成都慢游手册`;
  if (updateHash && location.hash !== `#page-${nextPage}`) {
    history.pushState({ page: nextPage }, "", `#page-${nextPage}`);
  }
  pageNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach((link) => link.addEventListener("click", () => showPage(link.dataset.page)));
document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});
prevButton.addEventListener("click", () => showPage(activePage - 1));
nextButton.addEventListener("click", () => showPage(activePage + 1));
menuToggle.addEventListener("click", () => {
  const open = pageNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowRight") showPage(activePage + 1);
  if (event.key === "ArrowLeft") showPage(activePage - 1);
});
window.addEventListener("popstate", () => {
  const pageFromHash = Number(location.hash.match(/^#page-(\d)$/)?.[1]) || 1;
  showPage(pageFromHash, false);
});

document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelector(".filter-chip.is-selected")?.classList.remove("is-selected");
    chip.classList.add("is-selected");
    const kind = chip.dataset.filter;
    document.querySelectorAll(".attraction-card").forEach((card) => {
      card.hidden = kind !== "all" && !card.dataset.kind.split(" ").includes(kind);
    });
  });
});

document.querySelectorAll(".route-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelector(".route-tab.is-selected")?.classList.remove("is-selected");
    document.querySelector(".route-panel.is-visible")?.classList.remove("is-visible");
    tab.classList.add("is-selected");
    document.getElementById(tab.dataset.route).classList.add("is-visible");
  });
});

const initialPage = Number(location.hash.match(/^#page-(\d)$/)?.[1]) || 1;
showPage(initialPage, false);
