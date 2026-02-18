import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import api from '../libs/apiCall.js';
import Input from './ui/input.jsx';
import { BiLoader } from 'react-icons/bi';
import {Button} from './ui/button.tsx';


const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm();

    const [loading , setLoading] = useState(false);

    const submitPasswordHandler = async (data) => {
        try{
            setLoading(true);
            const { data : res}  = await api.put(`/users/change-password` ,data);

            if(res?.status === 200){
                toast.success(res?.message);
            }
        } catch(error){
            console.error("Something went wrong" , error);
            toast.error(error?.response?.data?.message || error.message);
        } finally{
            setLoading(false);
        }
    }
  return (
    <div className = "py-20">
      <form onSubmit = {handleSubmit(submitPasswordHandler)}>
         <div className = 'mb-10'>
            <p className = "text-xl font-bold text-black dark:text-white mb-1">
                Change Password
            </p>
            <span className = 'labelStyles'>
                This will change your account password.
            </span>

            <div className = 'mt-6 space-y-6'>
              <Input
                    disabled = {loading}
                    label = "Current Password"
                    type = "password"
                    name = "currentPassword"
                    placeholder = "Enter current password"
                    className = "inputStyle"
                    error = {errors.currentPassword ? errors.currentPassword.message : ""}
                   {...register("currentPassword" , {
                        required : "Current password is required"
                   })}
                    
               />
               <Input
                    disabled = {loading}
                    type = "password"
                    label = "New Password"
                    name = "newPassword"
                    placeholder = "Enter new password"
                    className = "inputStyle"
                    error = {errors.newPassword ? errors.newPassword.message : ""}
                    {...register("newPassword" , {
                        required : "New password is required",
                        minLength : {
                            value : 6,
                            message : "Password must be at least 6 characters long"
                        }
                    })}
                />
                <Input 
                    disabled = {loading}
                    type = "password"
                    label = "Confirm New Password"
                    name = "confirmPassword"
                    placeholder = "Confirm new password"
                    error = {errors.confirmPassword ? errors.confirmPassword.message : ""}
                    className = "inputStyle"
                   {...register("confirmPassword" , {
                        required : "Please confirm your new password",
                        validate : (value) => 
                            value === getValues("newPassword") || "Passwords do not match"
                   })}
                />
            </div>
         </div>

              
               <div className = "flex bg-transparent items-center gap-6 justify-end pb-10 border-b-2 border-gray-200 dark:border-gray-800 py-10">
                 <Button
                    variant = "outline"
                    loading = {loading}
                    type= "reset"
                    className = "px-6 text-black dark:text-black border border-gray-200 dark:border-gray-700"
                 >
                   Reset 
                 </Button>
                 <Button
                     loading = {loading}
                     type= "submit"
                     className = "px-8 bg-violet-800  text-white"
                 >
                   {loading ? <BiLoader className='animate-spin text-white' /> : "Save"}
                 </Button>
               </div>
      </form>
    </div>
  )
}

export default ChangePassword
