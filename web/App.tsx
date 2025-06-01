import { useEffect, useState } from 'react'
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import { API_URL } from './consts.ts';
import Transactions from './Transactions.tsx';

function App() {
  const [path, setPath] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt != null) {
      fetch(`${API_URL}/queryuser`, { headers: { "Authorization": jwt } }).then((response) => {
        if (response.status == 401) {
          localStorage.removeItem("jwt");
          return;
        }
        response.json().then((body) => {
          setPath("home");
          setUser(body);
        });
      });
    } else {
      setPath("signin");
    }
  }, []);

  let content;
  if (path == "signin") {
    content = <Login onPathChange={(path) => setPath(path)} onUserChange={(user) => setUser(user)} />
  } else if (path == "home") {
    content = <Home onPathChange={(path) => setPath(path)} setUser={setUser} user={user} />
  } else if (path == "signup") {
    content = <Signup onPathChange={(path) => setPath(path)} onUserChange={(u) => setUser(u)} />
  } else if (path == "transactions") {
    content = <Transactions user={user} setUser={setUser} setPath={setPath} />
  }

  return (
    <>
      {content}
    </>
  )
}

export default App
