import { type ComponentPropsWithoutRef } from "react"

type LabelProps = ComponentPropsWithoutRef<"label">

export default function Label({ className, ...props }: LabelProps) {
  return (
    <label className={`text-gray-700 dark:text-white font-medium ${className}`} {...props}> {props.children} </label>
  )
}

