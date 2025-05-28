import { type ComponentPropsWithoutRef } from "react"

type LabelProps = ComponentPropsWithoutRef<"label">

export default function Input({ className, ...props }: LabelProps) {
  return (
    <label className={`text-gray-700 font-medium ${className}`} {...props}> {props.children} </label>
  )
}

