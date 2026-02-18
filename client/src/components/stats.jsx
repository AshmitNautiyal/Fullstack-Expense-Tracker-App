import React from "react";
import { BsCashCoin, BsCurrencyDollar } from "react-icons/bs";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { SiCashapp } from "react-icons/si";
import { Card } from "./ui/card";
import { formatCurrency } from "../libs/index";



const ICON_STYLES = [
  "bg-blue-300 text-blue-800",
  "bg-emerald-300 text-emerald-800",
  "bg-rose-300 text-rose-800",
];

const Stats = ({ dt }) => {
    const data = [
  {
    label: "Total Balance",
    amount: dt?.balance,
    increase: 10.9,
    icon: <BsCurrencyDollar size={26} />,
  },
  {
    label: "Total Income",
    amount: dt?.income,
    icon: <BsCashCoin size={26} />,
    increase: 8.9,
  },
  {
    label: "Total Expense",
    amount: dt?.expense,
    icon: <SiCashapp size={26} />,
    increase: -10.9,
  },
];
  const ItemCard = ({item , index}) => {
    return(
        
        <Card className = "w-full 2xl:min-w-96 flex items-center justify-between gap-5 px-4 md:px-8 py-12 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-900 shadow-slate-500">
           <div className = "flex items-center w-full h-full gap-4">
               <div className = {`flex items-center justify-center w-12 h-12 rounded-full ${ICON_STYLES[index]}`}>
                 {item.icon}
               </div>
                <div className = "space-y-3">
                    <span className = "text-base text-gray-600 dark:text-gray-400 md:text-lg">
                        {item.label}
                    </span>
                 <p className = "text-2xl font-medium text-black 2xl:text-3xl dark:text-gray-400">
                     {formatCurrency(item?.amount || 0.0)}
                 </p>
                  <span className = "text-xs text-gray-600 md:text-sm 2xl:text-vase dark:text-gray-500">
                     Overall {item.label}
                    </span>
                </div>
            </div>
        </Card>
    );
  }
    return (
        <div className = "flex flex-col items-center justify-between gap-8 mb-20 md:flex-row 2xl:gap-x-40">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 2xl:gap-30 mb-20 w-full">
      {data.map((item, index) => (
        <ItemCard key={index} item={item} index={index} />
      ))}
    </div>
        </div>
    );
};

export default Stats;