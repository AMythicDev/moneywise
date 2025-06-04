import Input from "./components/Input";
import Button from "./components/Button";
import Label from "./components/Label";
import ErrorMessage from "./components/ErrorMessage";
import { API_URL } from "./consts";
import { useContext, useState, type FormEvent } from "react";
import Base from "./components/Base";
import { SetInitialContext } from "./contexts";

export default function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailUsed, setEmailUsed] = useState(false);

  const [setPath, setUser] = useContext(SetInitialContext);

  const isPasswordValid = () => {
    if (password.length > 0 && password.length < 8) {
      return false;
    }
    return true;
  }
  const isCPasswordValid = () => {
    if (cpassword.length > 0 && cpassword != password) {
      return false;
    }
    return true;
  }

  const signUpUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!isPasswordValid() || !isCPasswordValid()) {
        return;
      }
      const user = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
      }
      const response = await fetch(`${API_URL}/signup`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(user) })
      if (response.status == 409) {
        setEmailUsed(true);
        return;
      }
      const body = await response.json();
      setEmailUsed(false);
      localStorage.setItem("jwt", body.jwt);
      setUser!(body);
      setPath!("home");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Base className="flex flex-col justify-center items-center">
      <div className="lg:w-max p-10 bg-white/70 shadow-sm dark:bg-slate-800/70 rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl font-extrabold text-center mb-2 ">Create your Account</h1>
        <p className="text-center w-full mb-6 text-gray-600 text-sm dark:text-gray-400">Start your journey to better financial management</p>
        <form className="flex flex-col gap-2 mb-3" onSubmit={signUpUser}>
          <div className="flex gap-3">
            <div>
              <Label htmlFor="firstname">First Name</Label>
              <Input type="text" className="border-gray-200 bg-white" placeholder="john" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lastname">Last Name</Label>
              <Input type="text" className="border-gray-200 bg-white" placeholder="doe" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </div>
          </div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" className="border-gray-200 bg-white" placeholder="johndoe@email.com" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailUsed ?
            <ErrorMessage>The email has already been taken</ErrorMessage> : null}
          <Label htmlFor="password">Password</Label>
          <Input type={showPassword ? 'text' : `password`} className={`border-gray-200 bg-white ${isPasswordValid() ? 'mb-2' : ''}`} placeholder="Create a strong password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {!isPasswordValid() ?
            <ErrorMessage className="mb-2">Password must be at least eight characters long</ErrorMessage> : null}
          <Label htmlFor="cpassword">Confirm Password</Label>
          <Input type={showPassword ? 'text' : `password`} className={`border-gray-200 bg-white ${isCPasswordValid() ? 'mb-2' : ''}`} placeholder="Confirm your password" id="cpassword" value={cpassword} onChange={(e) => setCPassword(e.target.value)} />
          {!isCPasswordValid() ? <ErrorMessage className="mb-2">Confirm password does not match the password</ErrorMessage> : null}
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

          <Button className="w-full" loading={isLoading} type="submit">{isLoading ? "Signing up..." : "Sign Up"}</Button>
        </form>
        <p className="text-center ">Already have an account? <a href="#" onClick={() => setPath!("signin")} className="text-cyan-700 hover:text-cyan-900 dark:text-teal-500 dark:hover:text-teal-300">Sign In</a> </p>
      </div >
    </Base >
  )
}

