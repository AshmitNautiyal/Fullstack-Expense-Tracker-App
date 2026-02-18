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
import { toast } from 'sonner';
import api from '../../libs/apiCall.js';
import userStore from '../../store/index.js';

const LoginSchema = z.object({
  email : z.string({required_error: "Email is required"}).email({message: "Invalid email address"}),
  password : z.string({required_error: "Password is required"}).min(1, {message: "Password is required"}),
});

const SignIn = () => {
  const {user , setCredentials} = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(LoginSchema),
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
      
      const {data: res}  = await api.post("/auth/login" , data);
      if(res?.user){
        toast.success(res?.message || "Logged in successfully.");
        const userInfo = {...res.user , token: res.token};
        localStorage.setItem("user" , JSON.stringify(userInfo));
        setCredentials(userInfo);
        setTimeout(() => {
          navigate("/overview");
        } , 1500);
      }
    }catch(error){
      console.log(error);
      toast.error(error?.response?.data?.message || error.message );
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full py-10">
      <Card className = "w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden">
       <div className ="p-6 md: -8">
         <CardHeader className = "py-0">
          <CardTitle className = "mb-8 text-center dark:text-white">
            Sign In
          </CardTitle>
         </CardHeader>
         <CardContent className = "p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className = "mb-8 space-y-6">
              <SocialAuth isLoading={loading} setLoading={setLoading} />
              <Separator />

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
                {loading ? <BiLoader className = "text-2xl text-white animate-spin" /> : "Sign In"}
              </Button>
          </form>
         </CardContent>
       </div>
       <CardFooter className = "justify-center gap-2">
        <p className = "text-sm text-gray-600 dark:text-gray-400">Don't have an account?</p>
         <Link 
         to = "/sign-up"
          className = "text-sm font-semibold text-violet-800 hover:underline"
          >Sign Up
          </Link>
       </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn
    