import { useState } from 'react'
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";

function App() {
  const [path, setPath] = useState("signin");
  let content;
  if (path == "signin") {
    content = <Login onPathChange={(path) => setPath(path)} />
  }
  else if (path == "signup") {
    content = <Signup onPathChange={(path) => setPath(path)} />
  } else {
    content = <h1>Logged In</h1>
  }

  return (
    <>
      {content}
    </>
  )
}

export default App
