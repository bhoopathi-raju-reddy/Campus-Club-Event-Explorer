import { loadEvents } from './data.js';
import { storage } from './storage.js';
import { dom, renderEvents, renderFilters, populateCategorySelect, updateSavedCount, setDebug } from './ui.js';

let events = [];
let activeCategory = '';
let savedEvents = storage.getSaved();
const registrations = new Map();

const filteredEvents = () => {
  const query = document.querySelector('#search-input').value.trim();
  const sort = document.querySelector('#sort-select').value;
  return [...events].filter(event => (!activeCategory || event.category === activeCategory) && (!query || event.matches(query))).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : a.date.localeCompare(b.date));
};

function refresh() { renderEvents(filteredEvents(), savedEvents); updateSavedCount(savedEvents); }
function toggleSaved(id) { savedEvents.has(id) ? savedEvents.delete(id) : savedEvents.add(id); storage.setSaved(savedEvents); refresh(); setDebug('saved', `${savedEvents.size} saved event${savedEvents.size === 1 ? '' : 's'} in localStorage`); }
function applyDraft() { const draft = storage.getDraft(); Object.entries(draft).forEach(([key, value]) => { const field = dom.form.elements[key]; if (field && field.type !== 'radio' && field.type !== 'checkbox') field.value = value; }); }

async function init() {
  document.body.classList.toggle('dark', storage.getTheme() === 'dark');
  try {
    events = await loadEvents();
    const categories = [...new Set(events.map(({ category }) => category))];
    renderFilters(categories, activeCategory);
    populateCategorySelect(categories);
    refresh();
    applyDraft();
    setDebug('loaded', `${events.length} events loaded; ${categories.length} categories found`);
    console.table(events.map(({ title, category, date }) => ({ title, category, date })));
  } catch (error) {
    dom.loading.hidden = true;
    dom.empty.hidden = false;
    dom.empty.textContent = 'We could not load campus events right now. Please refresh and try again.';
    setDebug('error', error.message);
  }
}

document.querySelector('#search-input').addEventListener('input', refresh);
document.querySelector('#sort-select').addEventListener('change', refresh);
dom.filters.addEventListener('click', event => { const button = event.target.closest('[data-filter]'); if (!button) return; activeCategory = button.dataset.filter; renderFilters([...new Set(events.map(({ category }) => category))], activeCategory); refresh(); });
dom.grid.addEventListener('click', event => { const button = event.target.closest('[data-save]'); if (button) toggleSaved(button.dataset.save); });
document.querySelector('.category-grid').addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; activeCategory = button.dataset.category; document.querySelector('#events').scrollIntoView({ behavior: 'smooth' }); renderFilters([...new Set(events.map(({ category }) => category))], activeCategory); refresh(); });
document.querySelector('#theme-toggle').addEventListener('click', event => { const isDark = document.body.classList.toggle('dark'); storage.setTheme(isDark ? 'dark' : 'light'); event.currentTarget.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`); setDebug('theme', `${isDark ? 'dark' : 'light'} theme stored in localStorage`); });
dom.form.addEventListener('input', () => { storage.saveDraft(Object.fromEntries(new FormData(dom.form))); });
dom.form.addEventListener('submit', event => { event.preventDefault(); const formData = Object.fromEntries(new FormData(dom.form)); const required = ['name', 'email', 'phone', 'category', 'date']; const missing = required.filter(field => !formData[field]); if (missing.length || !dom.form.checkValidity()) { dom.status.textContent = 'Please check the required fields and try again.'; setDebug('validation', `Registration blocked; missing or invalid fields: ${missing.join(', ') || 'format check'}`); return; } const registrationId = `registration-${Date.now()}`; registrations.set(registrationId, { ...formData, createdAt: new Date().toISOString() }); dom.status.textContent = `You’re on the list, ${formData.name.split(' ')[0]}! Check your inbox for the details.`; dom.form.reset(); sessionStorage.removeItem('campus-registration-draft'); setDebug('registered', `${registrations.size} registration stored in this session`); console.table([...registrations.values()]); });
document.querySelector('#featured-register').addEventListener('click', () => { document.querySelector('#register').scrollIntoView({ behavior: 'smooth' }); document.querySelector('#event-category').value = 'Social'; document.querySelector('#event-date').value = '2025-10-16'; });
init();
