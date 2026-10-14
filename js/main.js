// ---------- theme toggle ----------
(function themeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = () => root.dataset.theme || (systemDark() ? "dark" : "light");
  const label = () => btn.setAttribute("aria-label", current() === "dark" ? "Switch to light theme" : "Switch to dark theme");
  label();
  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* storage may be blocked */ }
    label();
  });
})();

// ---------- projects ----------
const list = document.getElementById("project-list");
const empty = document.getElementById("project-empty");
let projects = [];

function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderProjects(filter = "all") {
  list.replaceChildren();
  const shown = projects.filter((p) => filter === "all" || p.tags.includes(filter));
  empty.hidden = shown.length > 0;

  shown.forEach((p) => {
    const item = el("li", { class: "project", "data-tags": p.tags.join(" "), "data-testid": `project-${p.id}` });

    const left = el("div");
    left.append(el("h3", {}, p.title));
    const links = el("div", { class: "project-links" });
    if (p.repo) links.append(el("a", { href: p.repo, target: "_blank", rel: "noopener" }, "GitHub"));
    if (p.demo) links.append(el("a", { href: p.demo, target: "_blank", rel: "noopener" }, "Live demo"));
    if (links.children.length) left.append(links);

    const right = el("div");
    right.append(el("p", { class: "project-summary" }, p.summary));
    const ul = el("ul", { class: "highlights" });
    p.highlights.forEach((h) => ul.append(el("li", {}, h)));
    right.append(ul);
    const stack = el("ul", { class: "stack", "aria-label": "Tech stack" });
    p.stack.forEach((s) => stack.append(el("li", {}, s)));
    right.append(stack);

    item.append(left, right);
    list.append(item);
  });
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    renderProjects(chip.dataset.filter);
  });
});

fetch("data/projects.json")
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((data) => {
    projects = data;
    renderProjects();
  })
  .catch(() => {
    empty.hidden = false;
    empty.textContent = "Projects couldn't load. See them on GitHub: github.com/pallavipatil1111";
  });

// ---------- copy email ----------
const copyBtn = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");
const email = document.getElementById("email-link").textContent.trim();
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Copied";
  } catch (e) {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById("email-link"));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    copyStatus.textContent = "Selected. Press Ctrl+C to copy";
  }
  setTimeout(() => (copyStatus.textContent = ""), 2500);
});

// ---------- contact form ----------
const form = document.getElementById("contact-form");
const rules = {
  "cf-name": (v) => (v.trim().length >= 2 ? "" : "Enter your name."),
  "cf-email": (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address, like name@example.com."),
  "cf-message": (v) => (v.trim().length >= 10 ? "" : "Write a message of at least 10 characters."),
};

function validate(id) {
  const input = document.getElementById(id);
  const msg = rules[id](input.value);
  document.getElementById(`${id}-error`).textContent = msg;
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  if (msg) input.setAttribute("aria-describedby", `${id}-error`);
  return !msg;
}

Object.keys(rules).forEach((id) => {
  document.getElementById(id).addEventListener("blur", () => validate(id));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const results = Object.keys(rules).map(validate);
  if (results.includes(false)) {
    document.getElementById(Object.keys(rules)[results.indexOf(false)]).focus();
    return;
  }
  const name = document.getElementById("cf-name").value.trim();
  const from = document.getElementById("cf-email").value.trim();
  const message = document.getElementById("cf-message").value.trim();
  const subject = encodeURIComponent(`Hello from ${name}`);
  const body = encodeURIComponent(`${message}\n\n${name}\n${from}`);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});
