import { loadEvents } from "./event.js";
import { getSavedEvents, setSavedEvents, getTheme, setTheme, saveFormProgress, restoreFormProgress } from "./storage.js";
import { renderEvents } from "./ui.js";

const $ = (selector) => document.querySelector(selector);
const grid = $("#event-grid");
const status = $("#event-status");
const filterWrap = $("#category-filters");
const searchInput = $("#search-input");
const sortSelect = $("#sort-select");
const form = $("#registration-form");
let events = [];
let activeCategory = "All";
let savedEvents = getSavedEvents();
const categories = new Set();

function render() {
  const query = searchInput.value;
  const visible = events.filter((event) => (activeCategory === "All" || event.category === activeCategory) && event.matches(query))
    .sort((a, b) => sortSelect.value === "latest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  renderEvents(visible, grid, savedEvents);
}

function setupCategories() {
  events.forEach(({ category }) => categories.add(category));
  [...categories].forEach((category) => {
    filterWrap.insertAdjacentHTML("beforeend", `<button class="filter-chip" type="button" data-category="${category}">${category}</button>`);
    $("#event-category").insertAdjacentHTML("beforeend", `<option value="${category}">${category}</option>`);
  });
}

function showFormMessage(message, type) {
  const output = $("#form-message");
  output.textContent = message;
  output.className = `form-message ${type}`;
}

async function init() {
  document.documentElement.dataset.theme = getTheme();
  $("#theme-toggle").textContent = getTheme() === "dark" ? "☀" : "☾";
  try {
    events = await loadEvents();
    setupCategories();
    restoreFormProgress(form);
    status.hidden = true;
    render();
    console.table(events.map(({ id, title, category, date }) => ({ id, title, category, date })));
  } catch (error) {
    console.error("Unable to load event data:", error);
    status.innerHTML = "We couldn’t load the events right now. Please refresh and try again.";
    status.classList.add("error");
  }
}

filterWrap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  filterWrap.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
  render();
});
document.querySelectorAll("[data-category-link]").forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.categoryLink;
  document.querySelector(`[data-category="${activeCategory}"]`)?.click();
  $("#events").scrollIntoView({ behavior: "smooth" });
}));
searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);
grid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  const registerButton = event.target.closest("[data-register]");
  if (saveButton) {
    const id = saveButton.dataset.save;
    savedEvents.has(id) ? savedEvents.delete(id) : savedEvents.add(id);
    setSavedEvents(savedEvents);
    console.log("Saved events:", [...savedEvents]);
    render();
  }
  if (registerButton) {
    $("#event-category").value = events.find(({ id }) => id === registerButton.dataset.register)?.category || "";
    $("#register").scrollIntoView({ behavior: "smooth" });
  }
});
$("#theme-toggle").addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  setTheme(theme);
  $("#theme-toggle").textContent = theme === "dark" ? "☀" : "☾";
  $("#theme-toggle").setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
});
form.addEventListener("input", () => saveFormProgress(form));
form.addEventListener("change", () => saveFormProgress(form));
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.querySelector(":invalid")?.focus();
    showFormMessage("Please complete the highlighted fields before registering.", "error");
    return;
  }
  const registration = Object.fromEntries(new FormData(form));
  console.log("Registration submitted:", registration);
  sessionStorage.removeItem("campus-explorer-form");
  form.reset();
  showFormMessage("You’re registered! Check your inbox for the event details.", "success");
});
$("#audio-toggle").addEventListener("click", async () => {
  const audio = $("#campus-audio");
  const button = $("#audio-toggle");
  if (audio.paused) {
    try {
      await audio.play();
      button.innerHTML = "Ⅱ <span>Pause ambient sound</span>";
      button.setAttribute("aria-pressed", "true");
    } catch (error) {
      console.error("Ambient audio could not be played:", error);
      button.innerHTML = "▶ <span>Audio unavailable</span>";
    }
  } else {
    audio.pause();
    button.innerHTML = "▶ <span>Play ambient sound</span>";
    button.setAttribute("aria-pressed", "false");
  }
});
init();
