import type { SetState, Transaction } from "../types";

interface TableRowProps {
  className?: string,
  type?: "income" | "expense" | "header",
  date: Date | string,
  description: string,
  user_id?: string,
  category: string,
  amount: number | string,
  recurring?: "Recurring" | "Never" | "Daily" | "Weekly" | "Monthly" | "Yearly"
  last?: boolean,
  controls?: boolean,
  header?: boolean,
  _id?: string,
  setDeleteTransactionRecord?: SetState<Transaction | null>,
  setUpdateTransactionRecord?: SetState<Transaction | null>
}

function formatDate(d: Date | string): string {
  if (typeof d == "string") return d;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function TableRow({ last = false, controls = false, setDeleteTransactionRecord = undefined, className, setUpdateTransactionRecord = undefined, ...props }: TableRowProps) {
  let amount_color = null;
  let sign = null;
  if (props.type == "expense") {
    amount_color = "text-red-400";
    sign = "-₹";
  } else if (props.type == "income") {
    amount_color = "text-teal-500";
    sign = "+₹";
  }

  // @ts-ignore
  const setUpdateRecord = () => setUpdateTransactionRecord({ ...props })
  // @ts-ignore
  const setDeleteRecord = () => setDeleteTransactionRecord({ ...props })

  return (
    <div className={`min-w-max flex pl-2 min-h-10 py-1 dark:${props.type == 'header' ? 'text-gray-400' : 'text-white'} ${!last ? 'border-b-2 border-gray-200 dark:border-gray-700' : null} ${className}`}>
      {controls == false ?
        <>
          <span className="min-w-24 inline-flex items-center">{formatDate(props.date)}</span>
          <span className="min-w-40 inline-flex items-center pr-5">{props.description ?? "-"}</span>
          <span className="min-w-32 inline-flex items-center">{props.category ?? "-"}</span>
          <span className="min-w-28 inline-flex items-center">{props.recurring ?? "Never"}</span>
          <span className={`min-w-20 justify-end inline-flex items-center ${amount_color}`}>{sign}{props.amount}</span>
        </> :
        <>
          <span className="min-w-30 inline-flex items-center">{formatDate(props.date)}</span>
          <span className="min-w-52 inline-flex items-center">{props.description}</span>
          <span className="min-w-32 inline-flex items-center">{props.category ?? "-"}</span>
          <span className="min-w-28 inline-flex items-center">{props.recurring ?? "Never"}</span>
          <span className={`min-w-20 justify-end inline-flex items-center mr-10 ${amount_color}`}>{sign}{props.amount}</span>
          {props.type != "header" ?
            <div className="flex w-full justify-end">
              <button className="min-w-15 border-2 rounded-lg border-teal-500 hover:text-white hover:bg-teal-500 transition-colors mr-10" onClick={setUpdateRecord}>Edit</button>
              <button className="min-w-20 border-2 rounded-lg border-red-400 hover:text-white hover:bg-red-400 transition-colors" onClick={setDeleteRecord}>Delete</button>
            </div> :
            <>
              <div className="min-w-34"></div>
              <div className="min-w-20"></div>
            </>
          }
        </>}
    </div >
  )
}
