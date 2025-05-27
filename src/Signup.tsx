import Input from "./components/Input";
import Button from "./components/Button";
import Label from "./components/Label";

export default function Login({ onPathChange }: { onPathChange: (path: string) => void }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 flex flex-col bg-white min-h-screen justify-center items-center">
      <div className="w-max p-10 bg-white/70 shadow-xl rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl font-extrabold text-center mb-2">Create your Account</h1>
        <p className="text-center w-full mb-6 text-gray-600 text-sm">Start your journey to better financial management</p>
        <form className="flex flex-col gap-2 mb-3">
          <div className="flex gap-3">
            <div>
              <Label htmlFor="firstname">First Name</Label>
              <Input type="text" className="border-gray-200 bg-white" placeholder="john" id="firstname" />
            </div>
            <div>
              <Label htmlFor="lastname">Last Name</Label>
              <Input type="text" className="border-gray-200 bg-white" placeholder="doe" id="lastname" />
            </div>
          </div>
          <Label htmlFor="username">Username</Label>
          <Input type="text" className="border-gray-200 bg-white" placeholder="johndoe" id="username" />
          <Label htmlFor="password">Password</Label>
          <Input type="password" className="border-gray-200 bg-white mb-2" placeholder="Create a strong password" id="password" />
          <Label htmlFor="cpassword">Confirm Password</Label>
          <Input type="password" className="border-gray-200 bg-white mb-2" placeholder="Confirm your password" id="cpassword" />
          <Button type="submit">Sign Up</Button>
        </form>
        <p className="text-center">Already have an account? <a href="#" onClick={() => onPathChange("signin")} className="text-cyan-700 hover:text-cyan-900">Sign In</a> </p>
      </div >
    </div >
  )
}

