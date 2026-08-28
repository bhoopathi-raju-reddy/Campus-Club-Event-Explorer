export const dom = {
  grid: document.querySelector('#event-grid'), loading: document.querySelector('#loading-state'), empty: document.querySelector('#empty-state'), filters: document.querySelector('#category-filters'), savedCount: document.querySelector('#saved-count'), form: document.querySelector('#registration-form'), status: document.querySelector('#form-status'), debug: document.querySelector('#debug-output'), debugStatus: document.querySelector('#debug-status'), categorySelect: document.querySelector('#event-category')
};

export function renderFilters(categories, active) {
  dom.filters.innerHTML = ['All events', ...categories].map(category => `<button class="pill ${category === active ? 'selected' : ''}" data-filter="${category === 'All events' ? '' : category}">${category}</button>`).join('');
}

export function renderEvents(events, saved) {
  dom.loading.hidden = true;
  dom.empty.hidden = events.length > 0;
  dom.grid.innerHTML = events.map(event => `<article class="event-card"><div class="card-image" style="background-image:url('${event.image}'); background-color:${event.accent}" role="img" aria-label="Image for ${event.title}"><span class="card-date">${event.formattedDate}</span><button class="save-button ${saved.has(event.id) ? 'saved' : ''}" data-save="${event.id}" aria-label="${saved.has(event.id) ? 'Unsave' : 'Save'} ${event.title}" title="${saved.has(event.id) ? 'Remove saved event' : 'Save event'}">${saved.has(event.id) ? '♥' : '♡'}</button></div><div class="card-content"><span class="card-category">${event.category}</span><h3>${event.title}</h3><p>${event.description}</p><div class="card-meta"><span>${event.time}</span><span>${event.location}</span></div></div></article>`).join('');
}

export function populateCategorySelect(categories) { dom.categorySelect.innerHTML += categories.map(category => `<option value="${category}">${category}</option>`).join(''); }
export function updateSavedCount(saved) { dom.savedCount.textContent = saved.size; }
export function setDebug(status, message) { dom.debugStatus.textContent = status; dom.debug.textContent = message; console.log(`[Campus Explorer] ${message}`); }
