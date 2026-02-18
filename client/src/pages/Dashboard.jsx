import React from 'react'
import api from "../libs/apiCall";
import { toast} from "sonner";
import {useState} from "react";
import Loading  from "../components/loading.jsx";
import { useEffect } from 'react';
import Info from '../components/info.jsx';
import Stats from '../components/stats.jsx';
import Chart from '../components/chart.jsx';
import DoughnutChart from '../components/piechart.jsx';
import RecentTransactions from '../components/recent-transactions.jsx';
import Accounts from '../components/account.jsx';

const Dashboard = () => {
  const[data , setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () =>{
    const URL = '/transaction/dashboard';
    try{
      const {data} = await api.get(URL);
      console.log(data);
      setData(data);
    }catch(error){
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Something unexpected happend. Please try again later."
      );
      if(error?.response?.data?.status === "auth_failed"){
        localStorage.removeItem("user");
        window.location.reload();
      }
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, []);

    if(isLoading){
      return(
        <div className = "flex item-center justify-center w-full h-[80vh]">
          <Loading />
        </div>
      )
    }
  return (
    <div className = "px-0 md:px-5 2xl:px-20">
       <Info title = "Dashboard" subTitle ={"Monitor your financial activites"} />
       <Stats
        dt = {{
          balance : data?.availableBalance,
          income : data?.totalIncome,
          expense : data?.totalExpense,
        }}
       />

       <div className = "flex flex-col-reverse items-center gap-10 w-full md:flex-row">
          <Chart data = {data?.chartData || []} />
          {data?.totalIncome > 0 && (
            <DoughnutChart 
            dt = {{
              balance : data?.availableBalance,
              income : data?.totalIncome,
              expense : data?.totalExpense,
            }}
            />
          )}
       </div>

       <div className = "flex flex-col-reverse gap-0 md:flex-row md:gap-10 2xl:gap-20">
          <RecentTransactions data = { data?.lastTransactions || []} />
           {data?.lastAccount?.length > 0 && <Accounts data = {data?.lastAccount || []} />}
       </div>
    </div>
  )
}

export default Dashboard
