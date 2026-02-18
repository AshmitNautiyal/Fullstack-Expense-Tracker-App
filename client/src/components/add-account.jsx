import React from 'react';
import useStore from "../store";
import { useState } from 'react';
import api from '../libs/apiCall.js';
import { toast } from 'sonner';
import { generateAccountNumber } from '../libs/index.js';
import { set, useForm } from 'react-hook-form';
import DialogWrapper from './wrappers/dialog-wrapper.jsx';
import { DialogPanel, DialogTitle} from '@headlessui/react';
import { MdOutlineWarning } from "react-icons/md";
import Input from "./ui/input.jsx";
import {Button} from "./ui/button.tsx"
import { BiLoader } from "react-icons/bi";

const accounts = ["Cash" , "Crypto" , "PayPal" , "Visa Debit Card"];

const AddAccount = ({isOpen , setIsOpen , refetch}) => {
    const {user} = useStore((state) => state);
    const{
        register , 
        handleSubmit,
        formState : {errors} ,
    } = useForm({
        defaultValues : {account_number : generateAccountNumber()},
    });

    const [selectedAccount , setSelectedAccount] = useState(accounts[0]);
    const [ loading , setLoading] = useState(false);

    const onSubmit = async (data) =>{
        try{
            setLoading(true);
            const newData = {...data , name: selectedAccount};
            const {data :res}  = await api.post("/accounts/create" , newData);
            if(res?.data){
                toast.success(res?.message || "Account created successfully");
                setIsOpen(false);
                refetch();

                setTimeout(() => {
        window.location.reload(); 
    }, 1000);
            }
        }catch(error){
            console.log(error);
            toast.error(error?.response?.data?.message || error.message);
        }finally{
            setLoading(false);
        }
    };

    function closeModal(){
        setIsOpen(false);
    }
   
  return (
   <DialogWrapper isOpen = {isOpen} closeModal = {closeModal}>
    <DialogPanel className = "w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle as = "h3" className = "text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 uppercase">
            Add Account
        </DialogTitle>

        <form onSubmit = {handleSubmit(onSubmit)} className = "space-y-6">
            <div className = "flex flex-col gap-1 mb-2">
              <p className = "text-gray-700 dark:text-gray-400 text-sm mb-2">
                Select Account Type
              </p>
                <select
                    onChange = {(e) => setSelectedAccount(e.target.value)}
                    className = "bg-transparent appereance-none border border-gray-300 dark:border-gray-800 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-500 outline-none focus:ring-1 ring-blue-500 dark:placeholder:text-gray-700"
                    >
                    {accounts.map((acc , index) =>(
                        <option key = {index} value = {acc} className = "w-full flex items-center justify-center dark:bg-slate-900">
                            {acc}
                        </option>
                    ))}
                    </select>
            </div>
            {user?.accounts?.includes(selectedAccount) && (
                <div className = "flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
                   <MdOutlineWarning size = {30} />
                   <span className = "text-sm">
                    You already have an account with this type. Please select a different account type.
                     </span>
                </div>
            )}

            {!user?.accounts?.includes(selectedAccount) && (
              <>
              <Input
                name="account_number"
                label = "Account Number"
                placeholder="Your account number"
                {...register("account_number")}
                error = {errors.account_number ? errors.account_number.message : ""}
                className="inputStyle"
                />
                <Input
                type = "number"
                name = "amount"
                label = "Initial Deposit Amount"
                placeholder = "1000"
                {...register("amount" , {
                    required : "Initial deposit amount is required",
                    min : {
                        value : 0,
                        message : "Initial deposit amount must be a positive number"
                    }
                })}
                error = {errors.amount ? errors.amount.message : ""}
                className="inputStyle"
                />
                <Button
                 disabled = {loading}
                 type = "submit"
                 className = "bg-violet-700 text-white w-full mt-4"
                >
                   {loading ? (<BiLoader className = "text-xl animate-spin" />) : ("Create Account ")}
                </Button>
              </>
                )}
        </form>
    </DialogPanel>
   </DialogWrapper>
  )
}

export default AddAccount
