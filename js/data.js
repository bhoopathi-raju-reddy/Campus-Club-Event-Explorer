export class CampusEvent {
  constructor({ id, title, category, date, time, location, description, image, accent }) {
    Object.assign(this, { id, title, category, date, time, location, description, image, accent });
  }
  get formattedDate() { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${this.date}T12:00:00`)); }
  get fullDate() { return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${this.date}T12:00:00`)); }
  matches(query) { return [this.title, this.category, this.location, this.description].join(' ').toLowerCase().includes(query.toLowerCase()); }
}

export async function loadEvents() {
  const response = await fetch('./data/events.json');
  if (!response.ok) throw new Error(`Event data returned ${response.status}`);
  const records = await response.json();
  return records.map(record => new CampusEvent(record));
}
