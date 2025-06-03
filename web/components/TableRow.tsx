interface TableRowProps {
  className?: string,
  type?: "income" | "expense" | "header",
  date: Date,
  description: string,
  category: string,
  amount: number | string,
  recurring: "Recurring" | "Never" | "Daily" | "Weekly" | "Monthly" | "Yearly"
  last: boolean,
  controls: boolean,
  header: boolean,
  id?: any,
}

function formatDate(d: Date | string): string {
  if (typeof d == "string") return d;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function TableRow({ last = false, controls = false, id = undefined, setDeleteTransactionRecord = undefined, className, setUpdateTransactionRecord = undefined, ...props }: TableRowProps) {
  let amount_color = null;
  let sign = null;
  if (props.type == "expense") {
    amount_color = "text-red-400";
    sign = "-₹";
  } else if (props.type == "income") {
    amount_color = "text-teal-500";
    sign = "+₹";
  }

  return (
    <div className={`flex justify-around min-h-10 py-1 dark:${props.type == 'header' ? 'text-gray-400' : 'text-white'} ${!last ? 'border-b-2 border-gray-200 dark:border-gray-700' : null} ${className}`}>
      {controls == false ?
        <>
          <span className="w-[20%] inline-flex items-center">{formatDate(props.date)}</span>
          <span className="w-[30%] inline-flex items-center pr-5">{props.description ?? "-"}</span>
          <span className="w-[25%] inline-flex items-center">{props.category ?? "-"}</span>
          <span className="w-[10%] inline-flex items-center">{props.recurring ?? "Never"}</span>
          <span className={`w-[15%] justify-end inline-flex items-center ${amount_color}`}>{sign}{props.amount}</span>
        </> :
        <>
          <span className="w-[20%] inline-flex items-center">{formatDate(props.date)}</span>
          <span className="w-[25%] inline-flex items-center pr-5">{props.description}</span>
          <span className="w-[15%] inline-flex items-center">{props.category ?? "-"}</span>
          <span className="w-[5%] inline-flex items-center">{props.recurring ?? "Never"}</span>
          <span className={`w-[10%] justify-end inline-flex items-center mr-10 ${amount_color}`}>{sign}{props.amount}</span>
          {props.type != "header" ? <>
                <button className="w-[5%] border-2 rounded-lg border-teal-500 hover:text-white hover:bg-teal-500 transition-colors" onClick={() =>
                  setUpdateTransactionRecord({ ...props, _id: id, })
                }>Edit</button>
                <button className="w-[5%] border-2 rounded-lg border-red-400 hover:text-white hover:bg-red-400 transition-colors" onClick={() => setDeleteTransactionRecord({...props, _id: id})}>Delete</button>
          </> : <>
            <span className="w-[5%] pr-2.5"></span>
            <span className="w-[5%]"></span>
          </>
          }
        </>}
    </div >
  )
}
//

