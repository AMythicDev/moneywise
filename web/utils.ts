import { API_URL } from "./consts";

export async function refetchUser(setUser) {
  const jwt = localStorage.getItem("jwt");
  const response = await fetch(`${API_URL}/queryuser`, { headers: { "Authorization": jwt } });
  const body = await response.json();
  setUser(body);
}

