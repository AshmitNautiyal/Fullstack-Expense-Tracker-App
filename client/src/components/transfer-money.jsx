import React , {useState} from "react";
import {Dialog , DialogPanel , DialogTitle} from "@headlessui/react";
import { useForm } from "react-hook-form";
import {MdOutlineWarning} from "react-icons/md";
import { useEffect } from "react";
import useStore from "../store";
import api from "../libs/apiCall.js";
import { toast } from "sonner";
import Input from "./ui/input.jsx";
import { Button } from "./ui/button.tsx";
import { formatCurrency } from "../libs/index.js";
import DialogWrapper from "./wrappers/dialog-wrapper.jsx";
import Loading from "./loading.jsx";

const TransferMoney = ({isOpen , setIsOpen ,refetch }) => {
  const {user}  = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState : {errors},
    watch,
  } = useForm();

  const [isLoading , setIsLoading] = useState(false);
  const [loading , setLoading] = useState(false);
  const[accountData , setAccountData] = useState([]);
  const[fromAccountInfo , setFromAccountInfo] = useState({});
const[toAccountInfo , setToAccountInfo] = useState({});

const submitHandler = async(data) =>{
    try{
       setIsLoading(true);
       const newData = {
        ...data,
        fromAccount : fromAccountInfo.id,
        toAccount : toAccountInfo.id,
       };
       const {data : res} = await api.put(`/transaction/transfer-money` , newData);
       if(res?.status === "success"){
        toast.success(res?.message || "Money transfered successfully");
        setIsOpen(false);
        refetch();
       }
    }catch(error){
        console.log(error);
     toast.error(error?.response?.data?.message || error.message);
    }finally{
      setIsLoading(false);
    }
    }

    const getAccountBalance  = (setAccount , val) => {
        const filteredAccount = accountData?.find(
            (account) => account.account_name === val
        )
        setAccount(filteredAccount);
    }

   function closeModal(){
    setIsOpen(false);
   }

   const fetchAccounts = async() =>{
    try{
        setLoading(true);
        const {data : res} = await api.get(`/accounts`);

        setAccountData(res?.data);
    }catch(error){
        console.log(error);
    }finally{
        setLoading(false);
    }
   };

useEffect(() => {
    fetchAccounts();
} , []);


    return (
          <DialogWrapper isOpen = {isOpen} closeModal = {closeModal}>
            <DialogPanel className = "w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as = "h3" className = "text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 uppercase">
                    Transfer Money
                </DialogTitle>
        
            {(isLoading || loading )? ( 
                <Loading />
            ):(
               <form onSubmit = {handleSubmit(submitHandler)}>
                 <div className = "flex flex-col gap-1 mb-2">
                  <p className = "text-gray-700 dark:text-gray-400 text-sm mb-2">
                    From Account
                  </p>
                  <select
                   onChange={(e) =>
                    getAccountBalance(setFromAccountInfo , e.target.value)
                   }
                    className = "inputStyles"
                   >
                     <option
                       disabled
                       selected
                       className = "w-full flex items-center justify-center dark:bg-slate-900"
                       >
                        Select Account
                       </option>
                       {accountData?.map((acc , index) =>(
                         <option
                         key = {index}
                        value = {acc?.account_name} 
                        className = "w-full flex items-center justify-center dark:bg-slate-900"
                         >
                        {acc?.account_name}{" - "}
                        {formatCurrency(acc?.account_balance)}
                         </option>
                       ))}
                   </select>
                 </div>

                 <div className = "flex flex-col gap-1 mb-2">
                   <p className = "text-gray-700 dark:text-gray-400 text-sm mb-2">
                    To Account
                   </p>
                  <select
                   onChange={(e) =>
                    getAccountBalance(setToAccountInfo , e.target.value)
                   }
                    className = "inputStyles"
                   >
                     <option
                       disabled
                       selected
                       className = "w-full flex items-center justify-center dark:bg-slate-900"
                       >
                        Select Account
                       </option>
                       {accountData?.map((acc , index) =>(
                         <option
                         key = {index}
                        value = {acc?.account_name} 
                        className = "w-full flex items-center justify-center dark:bg-slate-900"
                         >
                        {acc?.account_name}{" - "}
                        {formatCurrency(acc?.account_balance)}
                         </option>
                       ))}
                   </select>
                 </div>

                 {fromAccountInfo?.account_balance <= 0 && (
                    <div className = "flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded" >
                       <MdOutlineWarning size = {30} />
                        <span className = "text-sm">
                            You can not transfer money from this account. Insufficient account balance.
                        </span>
                    </div>
                 )}

                 {fromAccountInfo?.account_balance > 0 && toAccountInfo?.id && (
                   <>
                   <Input
                    type = "number"
                    name = "amount"
                    label = "Amount"
                    placeholder = "1000"
                    {...register("amount" , {
                        required : "Transaction amount is required",    
                    })}
                    error = {errors.amount ? errors.amount.message : ""}
                    />

                    <div className = "w-full mt-8">
                        <Button
                        disabled = {isLoading}
                        type = "submit"
                        className = 'bg-violet-700 text-white w-full'
                        >
                        {`Submit ${
                         watch("amount") ? formatCurrency(watch("amount")) : ""
                         }`}
                        </Button>
                    </div>
                  </>
                 )}
               </form>
            )}
            </DialogPanel>
           </DialogWrapper>
    )

}

export default TransferMoney;
