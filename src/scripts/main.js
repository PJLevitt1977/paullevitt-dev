/**
 * The entire client-side runtime.
 *
 * Everything here is progressive enhancement: with JavaScript disabled the
 * page renders every project and the filter bar never appears, because the
 * bar is injected from here rather than shipped in the HTML.
 */

const projects = document.querySelector("[data-projects]");

if (projects) {
  const tiles = [...projects.querySelectorAll("[data-kind]")];
  const kinds = [...new Set(tiles.map((t) => t.dataset.kind))];

  if (kinds.length > 1) {
    const bar = document.createElement("div");
    bar.className = "filter";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Filter projects by type");

    const status = document.createElement("p");
    status.className = "visually-hidden";
    status.setAttribute("role", "status");

    const labels = {
      all: "Everything",
      repo: "Code",
      "case-study": "Case studies",
      writing: "Writing",
    };

    const apply = (kind) => {
      let shown = 0;

      for (const tile of tiles) {
        const match = kind === "all" || tile.dataset.kind === kind;
        tile.hidden = !match;
        if (match) shown += 1;
      }

      for (const button of bar.children) {
        button.setAttribute("aria-pressed", String(button.dataset.filter === kind));
      }

      status.textContent = `Showing ${shown} of ${tiles.length} projects.`;
    };

    for (const kind of ["all", ...kinds]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.filter = kind;
      button.textContent = labels[kind] ?? kind;
      button.setAttribute("aria-pressed", String(kind === "all"));
      button.addEventListener("click", () => apply(kind));
      bar.append(button);
    }

    projects.before(bar);
    projects.after(status);
  }
}

/* Mark the nav item for whichever section is currently in view. */
const sections = document.querySelectorAll("main section[id]");
const navLinks = new Map(
  [...document.querySelectorAll('.masthead nav a[href^="#"]')].map((a) => [
    a.getAttribute("href").slice(1),
    a,
  ]),
);

if (sections.length && navLinks.size && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const link = navLinks.get(entry.target.id);
        if (!link) continue;

        if (entry.isIntersecting) {
          for (const other of navLinks.values()) other.removeAttribute("aria-current");
          link.setAttribute("aria-current", "page");
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  for (const section of sections) observer.observe(section);
}
