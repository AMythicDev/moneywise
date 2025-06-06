import { type ComponentPropsWithoutRef } from "react"

type InputProps = ComponentPropsWithoutRef<"input">

export default function Input({ type, className, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={
        "flex h-10 w-full rounded-md border bg-white dark:bg-slate-600 dark:border-gray-400 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-cyan-500 dark:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" + className
      }
      {...props}
    />
  )
}
