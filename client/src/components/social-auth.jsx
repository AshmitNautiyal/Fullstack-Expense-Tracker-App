import { GoogleAuthProvider , signInWithRedirect, 
  getRedirectResult} from "firebase/auth";
import { auth , googleprovider } from "../libs/firebaseConfig";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import useStore from "../store/index.js";
import {useNavigate} from "react-router-dom";
import React  ,{useEffect , useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {toast} from "sonner";
import api from "../libs/apiCall.js";
import { set } from "zod";

export const SocialAuth = ({isLoading , setLoading}) => {
  const [user] = useAuthState(auth);
  const [selectedProvider , setSelectedProvider] = useState("google");
  const [isNewLogin, setIsNewLogin] = useState(false);
  const {setCredentials} = useStore((state) => state);
  const navigate = useNavigate();
   
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setSelectedProvider("google");
    setIsNewLogin(true);
   try {
      // We set a temporary flag in sessionStorage because a redirect reloads the page
      sessionStorage.setItem("pendingLogin", "true");
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error starting redirect: ", error);
      sessionStorage.removeItem("pendingLogin");
    }
  };
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        const isPending = sessionStorage.getItem("pendingLogin");

        // Only proceed if we have a user AND we were actually expecting a login
        if (result?.user && isPending) {
          await saveUserToDb(result.user);
        }
      } catch (error) {
        console.error("Error getting redirect result: ", error);
        toast.error("Social login failed. Please try again.");
      } finally {
        sessionStorage.removeItem("pendingLogin");
      }
    };

    handleRedirectResult();
  }, []);

    useEffect(() => {
        const saveUserToDb = async () => {
            try{
                const userData = {
                    name : user.displayName,
                    email : user.email,
                    uid : user.uid,
                    provider : selectedProvider
                };
                setLoading(true);
                const {data:res} = await api.post("/auth/login" , userData);
                console.log(res);
                if(res?.user){
                    toast.success(res?.message);
                    const userInfo = { ...res?.user , token : res?.token};
                    localStorage.setItem("user" , JSON.stringify(userInfo));
                    setCredentials(userInfo);

                    setTimeout(() => {
                        navigate("/overview");
                    } , 1500);
                }
            }catch(error){
                console.log("Error saving user to DB: ", error);
                toast.error(error?.response?.data?.message || error.message);
            }finally{
                setLoading(false);
                setIsNewLogin(true);
            }
        };

        if(user && isNewLogin){
            saveUserToDb();
        }
    }, [user?.uid , isNewLogin]);

  return (
    <div className = "flex items-center gap-2">
        <Button
             onClick={signInWithGoogle}
             variant = "outline"
             disabled={isLoading}
             className = "w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
             type = "button"
             >
                <FcGoogle className = "mr-2 size-5" />
                Continue with Google
             </Button>
    </div>
  );
};