export class Event {
  constructor({ id, title, description, category, date, time, location, organizer, image }) {
    Object.assign(this, { id, title, description, category, date, time, location, organizer, image });
  }

  get formattedDate() {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${this.date}T12:00:00`));
  }

  get formattedTime() {
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(`1970-01-01T${this.time}`));
  }

  matches(query) {
    const searchable = `${this.title} ${this.description} ${this.category} ${this.location}`.toLowerCase();
    return searchable.includes(query.toLowerCase().trim());
  }

  toJSON() {
    return { ...this };
  }
}

export async function loadEvents(url = "data/events.json") {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Event data request failed: ${response.status}`);
  const records = await response.json();
  return records.map((record) => new Event(record));
}
