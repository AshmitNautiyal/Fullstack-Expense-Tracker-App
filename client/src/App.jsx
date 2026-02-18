import { useEffect, useState } from 'react'
import {Navigate , Outlet,  Route, Routes} from "react-router-dom";
import Signin from "./pages/auth/sign-in.jsx";
import SignUp from "./pages/auth/sign-up.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";
import Transactions from "./pages/Transactions.jsx";
import AccountPage from './pages/account-page.jsx';
import userStore from './store/index.js';
import { setAuthToken } from './libs/apiCall.js';
import { Toaster } from 'sonner';
import Navbar from './components/navbar.jsx';

 const RootLayout = () => {
    const {user}  = userStore((state) => state);
    console.log(user);
    setAuthToken(user?.token || "");
    return !user ? (
      <Navigate to="/sign-in" replace={true} />
    ) : (
      <>
        <Navbar />
        <div className="min-h-[calc(100vh - 100px)]">
          <Outlet />
        </div>
      </>
    )
  }
  
function App() {
  const{theme} = userStore((state) => state);

  useEffect(() => {
    if(theme === "dark"){
      document.body.classList.add("dark");
    }else{
      document.body.classList.remove("dark");
    }
  } , [theme]);
 
  return (<main>
    <div className = "w-full min-h-screen bg-gray-100 px-6 md:px-20 dark:bg-slate-900 ">
    <Routes>
      <Route element = {<RootLayout />}>
         <Route path="/" element={<Navigate to = "/overview" />} />
         <Route path = "/overview" element = {<Dashboard />} />
          <Route path = "/transactions" element = {<Transactions />} />
          <Route path = "/settings" element = {<Settings />} />
          <Route path = "/accounts" element = {<AccountPage />} />
      </Route>
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
    </div>
    <Toaster position="top-center" richColors />
  </main>
)}


export default App
  