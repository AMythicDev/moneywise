import Input from "./components/Input";
import Button from "./components/Button";
import Label from "./components/Label";
import ErrorMessage from "./components/ErrorMessage";
import { useContext, useState } from "react";
import { API_URL } from "./consts";
import type { User } from "./types";
import Base from "./components/Base";
import { SetInitialContext } from "./contexts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidCreds, setInvalidCreds] = useState(false);

  const [setPath, setUser] = useContext(SetInitialContext);;

  const isPasswordValid = () => {
    if (password.length > 0 && password.length < 8) {
      return false;
    }
    return true;
  }

  const signInUser = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!isPasswordValid()) {
        return;
      }
      const user = {
        email: email,
        password: password
      }
      const response = await fetch(`${API_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(user) })
      if (response.status == 401) {
        setInvalidCreds(true);
        return;
      }
      const body = await response.json();
      setInvalidCreds(false);
      localStorage.setItem("jwt", body.jwt);
      setUser(body);
      setPath("home");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Base className="flex flex-col justify-center items-center">
      <div className="lg:w-max p-10 bg-white/70 shadow-sm dark:bg-slate-800/70 rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl font-extrabold text-center mb-2">Welcome Back</h1>
        <p className="text-center w-full mb-6 text-gray-600 text-sm dark:text-gray-400">Sign in to your account to start tracking your expenses</p>
        <form className="flex flex-col gap-2 mb-3" onSubmit={signInUser}>
          <Label htmlFor="email">Email</Label>
          <Input type="email" className="border-gray-200 bg-white" placeholder="johndoe@email.com" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <Label htmlFor="password">Password</Label>
          <Input type={showPassword ? 'text' : `password`} className={`border-gray-200 bg-white ${isPasswordValid() ? 'mb-2' : ''}`} placeholder="Enter your password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {!isPasswordValid() ?
            <ErrorMessage className="mb-2">Password must be at least eight characters long</ErrorMessage> : null}
          {invalidCreds ?
            <ErrorMessage>The email/password combinations is not valid</ErrorMessage> : null}

          <div className="flex">
            <input
              id="showpassword"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 accent-cyan-700 mr-1"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <Label htmlFor="showpassword" className="translate-y-[-3px]">
              Show Password
            </Label>
          </div>
          <Button type="submit" className="w-full" loading={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <p className="text-center">Don't have an account? <a href="#" onClick={() => setPath("signup")} className="text-cyan-700 dark:text-teal-500 hover:text-cyan-900 dark:hover:text-teal-300">Sign Up</a> </p>
      </div>
    </Base >
  )
}
