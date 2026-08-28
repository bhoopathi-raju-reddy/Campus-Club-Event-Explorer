const SAVED_KEY = "campus-explorer-saved";
const THEME_KEY = "campus-explorer-theme";
const FORM_KEY = "campus-explorer-form";

export const getSavedEvents = () => new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
export const setSavedEvents = (saved) => localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));
export const getTheme = () => localStorage.getItem(THEME_KEY) || "light";
export const setTheme = (theme) => localStorage.setItem(THEME_KEY, theme);
export const saveFormProgress = (form) => sessionStorage.setItem(FORM_KEY, JSON.stringify(Object.fromEntries(new FormData(form))));
export const restoreFormProgress = (form) => {
  const saved = JSON.parse(sessionStorage.getItem(FORM_KEY) || "null");
  if (!saved) return;
  Object.entries(saved).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field) return;
    if (field instanceof RadioNodeList) [...field].forEach((radio) => { radio.checked = radio.value === value; });
    else if (field.type !== "checkbox") field.value = value;
  });
};
