import { DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineWarning } from "react-icons/md";
import { toast } from "sonner";
import { formatCurrency } from "../libs";
import api from "../libs/apiCall";
import useStore from "./../store";
import Loading from "./loading";
import DialogWrapper from "./wrappers/dialog-wrapper";
import Input from "./ui/input"; 
import { Button } from "./ui/button"; 

export const AddTransaction = ({ isOpen, setIsOpen, refetch }) => {
    const { user } = useStore((state) => state);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const [accountBalance, setAccountBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false); 
    const [accountData, setAccountData] = useState([]);
    const [accountInfo, setAccountInfo] = useState({});

    const submitHandler = async (data) => {
        try {
            setIsLoading(true);
            const newData = { ...data, source: accountInfo.account_name };

            const { data: res } = await api.post(`/transaction/add-transaction/${accountInfo.id}`, newData);
            if (res?.status === 200) {
                toast.success(res?.message);
                setIsOpen(false);
                refetch();
            }
        } catch (error) {
            console.error("Something went wrong:", error);
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getAccountBalance = (val) => {
        const filteredAccount = accountData?.find(
            (account) => account.account_name === val
        );
        setAccountBalance(filteredAccount ? filteredAccount.account_balance : 0);
        setAccountInfo(filteredAccount);
    };

    function closeModal() {
        setIsOpen(false);
    }

    const fetchAccounts = async () => {
        try {
            setIsLoading(true); 
            const { data: res } = await api.get(`/accounts`);
            setAccountData(res?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        if (isOpen) { 
            fetchAccounts();
        }
    }, [isOpen]);

    return (
        <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 uppercase">
                    Add Transaction
                </DialogTitle>

                {isLoading ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                        <div className="flex flex-col gap-1 mb-2">
                            <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                                Select Account
                            </p>
                            <select
                                onChange={(e) => getAccountBalance(e.target.value)}
                                className="inputStyles"
                                defaultValue=""
                            >
                                <option disabled value="">Select Account</option>
                                {accountData?.map((acc, index) => (
                                    <option key={index} value={acc?.account_name}>
                                        {acc?.account_name} {" - "}
                                        {formatCurrency(acc?.account_balance, user?.country?.currency)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {accountBalance <= 0 && (
                            <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
                                <MdOutlineWarning size={30} />
                                <span className="text-sm">
                                    Insufficient account balance for this transaction.
                                </span>
                            </div>
                        )}

                        {accountBalance > 0 && (
                            <>
                                <Input
                                    name="description"
                                    label="Description"
                                    placeholder="Grocery Store"
                                    {...register("description", { required: "Required" })}
                                    error={errors.description?.message}
                                />
                                <Input
                                    type="number"
                                    name="amount"
                                    label="Amount"
                                    placeholder="1000"
                                    {...register("amount", { required: "Required" })}
                                    error={errors.amount?.message}
                                />
                                <div className="w-full mt-8">
                                    <Button
                                        disabled={isLoading}
                                        type="submit"
                                        className='bg-violet-700 text-white w-full'
                                    >
                                        {`Submit ${watch("amount") ? formatCurrency(watch("amount")) : ""}`}
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                )}
            </DialogPanel>
        </DialogWrapper>
    );
};