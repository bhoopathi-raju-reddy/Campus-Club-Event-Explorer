export function createEventCard(event, saved) {
  return `<article class="event-card"><div class="event-image"><img src="${event.image}" alt="${event.title} event"><span class="date-badge">${event.formattedDate}</span><button class="save-button ${saved ? "saved" : ""}" type="button" data-save="${event.id}" aria-label="${saved ? "Remove" : "Save"} ${event.title}">${saved ? "♥" : "♡"}</button></div><div class="event-card-body"><div class="card-meta"><span>${event.category}</span><span>${event.formattedTime}</span></div><h3>${event.title}</h3><p>${event.description}</p><div class="card-footer"><span>⌖ ${event.location}</span><button class="card-register" type="button" data-register="${event.id}">Register →</button></div></div></article>`;
}

export function renderEvents(events, container, saved) {
  container.innerHTML = events.length ? events.map((event) => createEventCard(event, saved.has(event.id))).join("") : `<div class="empty-state"><strong>No events found</strong><span>Try a different search or category.</span></div>`;
}
