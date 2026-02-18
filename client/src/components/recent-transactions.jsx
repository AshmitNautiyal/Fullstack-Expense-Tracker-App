import React from "react";
import Title from "./title";
import { RiProgress3Line } from "react-icons/ri";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import {Link} from "react-router-dom";
import { formatCurrency } from "../libs";

const RecentTransactions = ({data}) => {
    return (
        <div  className="flex-1 w-full py-20">
            <div className = "flex items-center justify-between">
                <Title title = "Latest Transactions" />
                <Link to = "/transactions" className = "text-sm text-gray-600 dark:text-gray-500 hover:text-violet-600 hover:underline mr-5">
                    View All
                </Link>
            </div>
            <div className="mt-5 overflow-x-auto">
                <table className="w-full">
                    <thead className = "w-full border-b border-gray-300 dark:border-gray-700">
                        <tr className = "w-full text-left text-black dark:text-gray-400">
                            <th className="py-2">Date</th>
                            <th className="py-2 px-2">Description</th>
                            <th className="py-2 px-2">Status</th>
                            <th className="py-2 px-2">Source</th>
                            <th className="py-2 px-2">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data?.map((item , index) => (
                            <tr key={index} className = "w-full border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-500">
                               <td className = "py-4">
                                      {new Date(item.createdat).toLocaleDateString()}
                               </td>
                               
                               <td className="px-2 py-3">
                                 <div className = "flex flex-col">
                                     <p className = "text-base font-medium text-black 2xl:text-lg dark:text-gray-400 line-clamp-1">
                                         {item?.description}
                                     </p>
                                 </div>
                               </td>
                                  
                                  <td className="flex items-center gap-2 px-2 py-3">
                                        {item?.status === "pending" && <RiProgress3Line className = "text-amber-600" size={24} />}   
                                        {item?.status === "Completed" && <IoCheckmarkDoneCircle className = "text-emerald-600" size={24} />}
                                        {item?.status === "failed" && <TiWarning className = "text-red-500" size={24} />}
                                        <span className = "capitalize">{item?.status}</span>
                                  </td>
                                    <td className="px-2 py-3">
                                        <p className="line-clamp-1">{item?.source}</p>
                                    </td>

                                    <td className="px-2 py-3 font-medium text-black 2xl:text-lg dark:text-gray-400">
                                        <span
                                                        className = {`${
                                                          (item?.type === "income" || item?.type === "Received") ? "text-emerald-600" : "text-red-600"
                                                        } text-lg font-bold ml-1`}
                                                        >
                                                         {(item?.type === "income" || item?.type === "Received") ? "+" : "-"}
                                                        </span>
                                                        {formatCurrency(item?.amount)}
                                    </td>
                               </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
};

export default RecentTransactions;