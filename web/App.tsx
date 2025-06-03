import { useEffect, useState } from 'react'
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import { API_URL } from './consts.ts';
import Transactions from './Transactions.tsx';
import { SetInitialContext } from './contexts.ts';
import { type User } from './types.ts';

function App() {
  const [path, setPath] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

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
    content = <Login />
  } else if (path == "home") {
    content = <Home user={user} />
  } else if (path == "signup") {
    content = <Signup />
  } else if (path == "transactions") {
    content = <Transactions user={user!} />
  }

  return (
    <>
      <SetInitialContext.Provider value={[setPath, setUser]}>
        {content}
      </SetInitialContext.Provider>
    </>
  )
}

export default App
