import { useState } from "react"
import { API_URL } from "../consts";

interface TableRowProps {
  className?: string,
  type?: "income" | "expense" | "header",
  date: Date,
  description: string,
  category: string,
  amount: number | string,
  last: boolean,
  controls: boolean,
  header: boolean,
  id?: any,
}

function formatDate(d: Date | string): string {
  if (typeof d == "string") return d;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export default function TableRow({ last = false, controls = false, id = undefined, type, ...props }: TableRowProps) {
  let amount_color = null;
  let sign = null;
  if (type == "expense") {
    amount_color = "text-red-400";
    sign = "-₹";
  } else if (type == "income") {
    amount_color = "text-teal-500";
    sign = "+₹";
  }

  const [deletion, setDeletion] = useState(false);

  const handleDeletion = async () => {
    if (deletion == false) return setDeletion(true);
    const jwt = localStorage.getItem("jwt");
    await fetch(`${API_URL}/deletetransaction/${id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": jwt,
        },
      });
  }

  return (
        <div className={`flex justify-around min-h-10 py-1 dark:text-white ${!last ? 'border-b-2 border-gray-200 dark:border-gray-700' : null} + ${props.className}`}>
      {controls == false ?
    <>
          <span className="w-[20%] inline-flex items-center">{formatDate(props.date)}</span>
          <span className="w-[40%] inline-flex items-center pr-5">{props.description}</span>
          <span className="w-[20%] inline-flex items-center">{props.category}</span>
          <span className={`w-[20%] justify-end inline-flex items-center ${amount_color}`}>{sign}{props.amount}</span>
        </> :
        <>
          <span className="w-[20%] inline-flex items-center">{formatDate(props.date)}</span>
          <span className="w-[25%] inline-flex items-center pr-5">{props.description}</span>
          <span className="w-[20%] inline-flex items-center">{props.category}</span>
          <span className={`w-[20%] justify-start inline-flex items-center ${amount_color}`}>{sign}{props.amount}</span>
          {type != "header" ? <>
            {
              !deletion ? <>
                <button className="w-[5%] border-2 rounded-lg border-teal-500 hover:text-white hover:bg-teal-500 transition-colors">Edit</button>
                <button className="w-[5%] border-2 rounded-lg border-red-400 hover:text-white hover:bg-red-400 transition-colors" onClick={() => setDeletion(true)}>Delete</button>
              </> :
                <>
                  <button className="w-[5%] border-2 rounded-lg border-teal-500 hover:text-white hover:bg-teal-500 transition-colors" onClick={() => setDeletion(false)}>Cancel</button>
                  <button className="w-[5%] border-2 text-white bg-red-400 rounded-lg border-red-400 hover:text-white hover:bg-red-400 transition-colors" onClick={() => handleDeletion()}>Confirm</button>
                </>
            }
          </> : <>
            <span className="w-[5%] inline-flex items-center justify-end pr-2.5">{type != "header" && "E"}</span>
            <span className="w-[5%] inline-flex items-center justify-center">{type != "header" && "D"}</span>
          </>
          }
        </>}
    </div>
  )
}
//

