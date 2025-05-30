import Input from "./components/Input";
import Button from "./components/Button";
import Label from "./components/Label";
import ErrorMessage from "./components/ErrorMessage";
import { useState } from "react";
import { API_URL } from "./consts";
import type { User } from "./types";

export default function Login({ onPathChange, onUserChange }: { onPathChange: (path: string) => void, onUserChange: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidCreds, setInvalidCreds] = useState(false);

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
      onUserChange({_id: body._id, firstname: body.firstname, lastname: body.lastname});
      onPathChange("home");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 flex flex-col min-h-screen justify-center items-center">
      <div className="w-max p-10 bg-white/70 shadow-xl rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl font-extrabold text-center mb-2">Welcome Back</h1>
        <p className="text-center w-full mb-6 text-gray-600 text-sm">Sign in to your account to start tracking your expenses</p>
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

          <div className="flex mb-2">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 accent-cyan-700 mr-1"
            />
            <Label htmlFor="remember" className="translate-y-[-3px]">
              Remember me
            </Label>
          </div>
          <Button type="submit" className="w-full" loading={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <p className="text-center">Don't have an account? <a href="#" onClick={() => onPathChange("signup")} className="text-cyan-700 hover:text-cyan-900">Sign Up</a> </p>
      </div>
    </div >
  )
}
