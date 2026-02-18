import {Menu , MenuButton , MenuItem , MenuItems} from "@headlessui/react";
import {BiTransfer} from "react-icons/bi";
import {FaMoneyCheckDollar} from "react-icons/fa6";
import {MdMoreVert} from "react-icons/md";
import TransitionWrapper from "./wrappers/transition-wrapper";

export default function AccountMenu({addMoney , transferMoney}) {
    return (
     <>
        <Menu as = "div" className = "relative inline-block text-left">
            <MenuButton className = "inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-100">
                <MdMoreVert />
            </MenuButton>
            
            <TransitionWrapper>
                <MenuItems className = "absolute p-2 right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className = "px-1 py-1 ">
                        <MenuItem>
                            {({active}) => (
                                <button onClick = {transferMoney}
                                 className = {`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300 ${active ? 'bg-gray-100 dark:bg-slate-700' : ''}`}
                                 >
                                    <BiTransfer />
                                    Tranfer Funds
                                 </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({active}) => (
                                <button onClick = {addMoney}
                                 className = {`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300 ${active ? 'bg-gray-100 dark:bg-slate-700' : ''}`}
                                 >
                                    <FaMoneyCheckDollar />
                                    Add Money
                                 </button>
                            )}
                        </MenuItem> 
                    </div>
                </MenuItems>
            </TransitionWrapper>
        </Menu>
     </>
    )
}