import { type ComponentPropsWithoutRef } from "react"

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  loading: boolean
}

export default function Button({ children, loading = false, className, ...props }: ButtonProps) {
  return (
    <button
      className={`w-full bg-gradient-to-r ${loading ? 'from-teal-700 to-cyan-700' : 'from-teal-600 to-cyan-600'} hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg py-2.5 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

