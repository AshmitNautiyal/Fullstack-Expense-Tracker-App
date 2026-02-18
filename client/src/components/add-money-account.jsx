import React , {useState} from "react";
import {Dialog , DialogPanel , DialogTitle} from "@headlessui/react";
import { useForm } from "react-hook-form";
import api from "../libs/apiCall.js";
import { toast } from "sonner";
import Input from "./ui/input.jsx";
import { Button } from "./ui/button.tsx";
import { formatCurrency } from "../libs/index.js";
import DialogWrapper from "./wrappers/dialog-wrapper.jsx";

const AddMoney = ({isOpen , setIsOpen , id , refetch}) => {
    const {register , handleSubmit , formState : {errors} , watch,} = useForm();
    const[loading , setLoading] = useState(false);
    
    const submitHandler = async (data) =>{
        try{
            setLoading(true);
            const {data :res} = await api.put(`/accounts/add-money/${id}` , data);

            if(res?.data){
                toast.success(res?.message || "Money added successfully");
                setIsOpen(false);
                refetch();
            }
        } catch(error){
            console.log(error);
            toast.error(error?.response?.data?.message || error.message);
        } finally{
            setLoading(false);
        }
    };
    
    function closeModal(){
        setIsOpen(false);
    }

    return(
         <DialogWrapper isOpen = {isOpen} closeModal = {closeModal}>
    <DialogPanel className = "w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle as = "h3" className = "text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 uppercase">
            Add Money to Account
        </DialogTitle>

        <form onSubmit = {handleSubmit(submitHandler)} className = "space-y-6">
                <Input
                type = "number"
                name = "amount"
                label = "Amount"
                placeholder = "1000"
                {...register("amount" , {
                    required : "Amount is required",
                    min : {
                        value : 0,
                        message : "Amount must be a positive number"
                    }
                })}
                error = {errors.amount ? errors.amount.message : ""}
                className="inputStyle"
                />

                <div className = "w-full mt-8">
                  <Button
                     disabled = {loading}
                     type = "submit"
                     className = 'bg-violet-700 text-white w-full'
                  >
                    {`Submit ${
                        watch("amount") ? formatCurrency(watch("amount")) : ""
                     }`}
                  </Button>
                </div>
        </form>
    </DialogPanel>
   </DialogWrapper>
    )
}

export default AddMoney;

