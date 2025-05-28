// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import Input from "./components/Input";
import Button from "./components/Button";
import Label from "./components/Label";
import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { DollarSign, Eye, EyeOff } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
//
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   // const { toast } = useToast();
//
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setIsLoading(true);
//   //   
//   //   // Simulate login process
//   //   setTimeout(() => {
//   //     setIsLoading(false);
//   //     toast({
//   //       title: "Welcome back!",
//   //       description: "You have successfully signed in to your account.",
//   //     });
//   //   }, 1500);
//   // };
//   //
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="flex items-center justify-center mb-8">
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
//               <DollarSign className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-bold text-gray-900">ExpenseTracker</span>
//           </Link>
//         </div>
//
//         <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-white/20">
//           <CardHeader className="space-y-1 text-center">
//             <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
//             <CardDescription className="text-gray-600">
//               Sign in to your account to continue tracking your expenses
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-gray-700 font-medium">
//                   Email address
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//               
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-gray-700 font-medium">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>
//
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember"
//                     type="checkbox"
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
//                     Remember me
//                   </label>
//                 </div>
//                 // <Link to="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
//                 //   Forgot password?
//                 // </Link>
//               </div>
//
//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg py-2.5"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Signing in..." : "Sign in"}
//               </Button>
//             </form>
//
//             <div className="mt-6 text-center">
//               <p className="text-gray-600">
//                 Don't have an account?{" "}
//                 <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
//                   Sign up for free
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };
//
//
// <input className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" type="text" placeholder="Enter you username" />
// <input className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" type="password" placeholder="Enter your password" />

export default function Login({ onPathChange }: { onPathChange: (path: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordValid = () => {
    if (password.length > 0 && password.length < 8) {
      return false;
    }
    return true;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 flex flex-col bg-white min-h-screen justify-center items-center">
      <div className="w-max p-10 bg-white/70 shadow-xl rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl font-extrabold text-center mb-2">Welcome Back</h1>
        <p className="text-center w-full mb-6 text-gray-600 text-sm">Sign in to your account to start tracking your expenses</p>
        <form className="flex flex-col gap-2 mb-3">
          <Label htmlFor="username">Username</Label>
          <Input type="text" className="border-gray-200 bg-white" placeholder="johndoe" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

          <Label htmlFor="password">Password</Label>
          <Input type={showPassword ? 'text' : `password`} className={`border-gray-200 bg-white ${isPasswordValid() ? 'mb-2' : ''}`} placeholder="Enter your password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {!isPasswordValid() ?
            <p className="text-red-500 mb-2">Password must be at least eight characters long</p> : null}
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
          <Button type="submit">Sign In</Button>
        </form>
        <p className="text-center">Don't have an account? <a href="#" onClick={() => onPathChange("signup")} className="text-cyan-700 hover:text-cyan-900">Sign Up</a> </p>
      </div>
    </div >
  )
}
