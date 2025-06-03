import { API_URL } from "./consts";
import type { SetState, User } from "./types";

export async function refetchUser(setUser: SetState<User | null>): Promise<void> {
  const jwt = localStorage.getItem("jwt")!;
  const response = await fetch(`${API_URL}/queryuser`, { headers: { Authorization: jwt } });
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

export function getTheme(): string {
  if (localStorage.getItem("theme") == "light" || localStorage.getItem("theme") == "dark") return localStorage.getItem("theme")!;
  return "system";
}

