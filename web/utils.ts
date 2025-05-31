import { API_URL } from "./consts";

export async function refetchUser(setUser) {
  const jwt = localStorage.getItem("jwt");
  const response = await fetch(`${API_URL}/queryuser`, { headers: { "Authorization": jwt } });
  const body = await response.json();
  setUser(body);
}

export function setTheme(theme: string) {
  if (theme == "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", theme);
  }
  document.documentElement.classList.toggle("dark", localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),);
}

export function getTheme() {
  if (localStorage.getItem("theme") == null) return "system";
  if (localStorage.getItem("theme") == "light" || localStorage.getItem("theme") == "dark") return localStorage.getItem("theme");
}

