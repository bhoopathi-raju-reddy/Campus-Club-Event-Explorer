const SAVED_KEY = 'campus-saved-events';
const THEME_KEY = 'campus-theme';
const FORM_KEY = 'campus-registration-draft';

export const storage = {
  getSaved() { try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')); } catch { return new Set(); } },
  setSaved(saved) { localStorage.setItem(SAVED_KEY, JSON.stringify([...saved])); },
  getTheme() { return localStorage.getItem(THEME_KEY) || 'light'; },
  setTheme(theme) { localStorage.setItem(THEME_KEY, theme); },
  saveDraft(data) { sessionStorage.setItem(FORM_KEY, JSON.stringify(data)); },
  getDraft() { try { return JSON.parse(sessionStorage.getItem(FORM_KEY) || '{}'); } catch { return {}; } }
};
