interface TableRowProps {
  className?: string,
  type?: "income" | "expense",
  date: Date,
  description: string,
  category: string,
  amount: number | string,
  last: boolean
}

export function formatDate(d: Date | string): string {
  if (typeof d == "string") return d;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function TableRow({last = false, type, ...props}: TableRowProps) {
  let amount_color = null;
  let sign = null;
  if (type == "expense") {
    amount_color = "text-red-400";
  } else if (type == "income"){
    amount_color = "text-teal-500";
  }
  if (type == "expense") {
    sign = "-₹";
  } else if (type == "income"){
    sign = "+₹";
  }
  return (
    <div className={`flex justify-around min-h-10 py-1 ${!last ? 'border-b-2 border-gray-200' : null} + ${props.className}`}>
      <span className="w-[20%] inline-flex items-center">{formatDate(props.date)}</span>
      <span className="w-[40%] inline-flex items-center pr-5">{props.description}</span>
      <span className="w-[20%] inline-flex items-center">{props.category}</span>
      <span className={`w-[20%] justify-end inline-flex items-center ${amount_color}`}>{sign}{props.amount}</span>
    </div>
  )
}
