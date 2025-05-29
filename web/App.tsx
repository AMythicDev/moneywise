import { useState } from 'react'
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import { API_URL } from './consts.ts';

function App() {
  const [path, setPath] = useState("signin");
  const [user, setUser] = useState(null);

  const jwt = localStorage.getItem("jwt");
  if (jwt != null) {
    fetch(`${API_URL}/fetchuser?jwt=${jwt}`).then((response) => {
      if (response.json() == 401) {
        localStorage.removeItem("jwt");
        return;
      }
      response.json().then((body) => {
        setPath("home");
        setUser(body);
      });
    });
  }

  let content;
  if (path == "signin") {
    content = <Login onPathChange={(path) => setPath(path)} onUserChange={(user) => setUser(user)} />
  } else if (path == "home") {
    content = <Home onPathChange={(path) => setPath(path)} onUserChange={(u) => setUser(u)} user={user} />
  } else if (path == "signup") {
    content = <Signup onPathChange={(path) => setPath(path)} onUserChange={(u) => setUser(u)} />
  }

  return (
    <>
      {content}
    </>
  )
}

export default App
