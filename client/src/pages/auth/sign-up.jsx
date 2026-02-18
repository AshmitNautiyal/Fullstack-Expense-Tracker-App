import React, { useEffect } from 'react'
import * as z from "zod";
import useStore from '../../store/index.js';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"; 
import {useNavigate , Link} from "react-router-dom";
import {useState} from "react";
import {Card, CardContent, CardHeader , CardTitle , CardFooter} from "../../components/ui/card.jsx";
import { SocialAuth } from '../../components/social-auth.jsx';
import { Separator } from '../../components/separator.jsx';
import  Input  from '../../components/ui/input.jsx';
import { Button } from '../../components/ui/button.tsx';
import {BiLoader} from "react-icons/bi";
import api from '../../libs/apiCall.js';
import { toast } from 'sonner';

const RegisterSchema = z.object({
  email : z.string({required_error: "Email is required"}).email({message: "Invalid email address"}),
  firstName : z.string({required_error: "First name is required"}).min(2, {message: "Name must be at least 2 characters long"}),
  password : z.string({required_error: "Password is required"}).min(6, {message: "Password must be at least 6 characters long"}),
});

const SignUp = () => {
  const {user} = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
  });
  const navigate = useNavigate();
  const[loading, setLoading] = useState(false);
  
  useEffect(() =>{
    user && navigate("/");
  } , [user]);

  const onSubmit = async (data) => {
    try{
      setLoading(true);
      
      const {data: res}  = await api.post("/auth/signup" , data);
      if(res?.user){
        toast.success("Account created successfully. You can now login.");
        setTimeout(() => {
          navigate("/sign-in");
        } , 1500);
      }
    }catch(error){
      console.log(error);
      toast.error(error?.response?.data?.message || error.message );
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full py-10">
      <Card className = "w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden">
       <div className ="p-6 md: -8">
         <CardHeader className = "py-0">
          <CardTitle className = "mb-8 text-center dark:text-white">
            Create Account
          </CardTitle>
         </CardHeader>
         <CardContent className = "p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className = "mb-8 space-y-6">
              <SocialAuth isLoading={loading} setLoading={setLoading} />
              <Separator />

              <Input 
              disabled={loading}
              id = "firstName"
              label = "Name"
              name = "firstName"
              type = "text"
              placeholder = "Enter your name"
              error = {errors?.firstName?.message}
              {...register("firstName")}
              className = "text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
              />
              <Input 
              disabled={loading}
              id = "email"
              label = "Email"
              name = "email"
              type = "email"
              placeholder = "Enter your email"
              error = {errors?.email?.message}
              {...register("email")}
              className = "text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
              />
              <Input 
              disabled={loading}
              id = "password"
              label = "Password"
              name = "password"
              type = "password"
              placeholder = "Enter your password"
              error = {errors?.password?.message}
              {...register("password")}
              className = "text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
              />
            </div>
            <Button 
              disabled={loading}
              type = "submit"
              className = "w-full bg-violet-800"
              >
                {loading ? <BiLoader className = "text-2xl text-white animate-spin" /> : "Create Account"}
              </Button>
          </form>
         </CardContent>
       </div>
       <CardFooter className = "justify-center gap-2">
        <p className = "text-sm text-gray-600 dark:text-gray-400">Already have an account?</p>
         <Link 
         to = "/sign-in"
          className = "text-sm font-semibold text-violet-800 hover:underline"
          >Sign In
          </Link>
       </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp