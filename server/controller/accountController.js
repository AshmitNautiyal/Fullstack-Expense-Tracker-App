import pool from '../libs/database.js';

export const getAccounts = async (req , res) =>{
    try {
        const userId = req.user.userId;

        const accounts = await pool.query('SELECT * FROM tblaccount WHERE user_id = $1', [userId]);

        res.status(200).json({
            status: 200,
            message: "Accounts retrieved successfully",
            data: accounts.rows
        });
    }catch (error){
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

export const createAccount = async (req , res) =>{
    try {
        const userId = req.user.userId;
        const {name , amount , account_number} = req.body;

        
     const accountExists = await pool.query('SELECT * FROM tblaccount WHERE account_number  = $1 AND user_id = $2', [account_number , userId]);
        if(accountExists.rows.length > 0){
            return res.status(400).json({
                status: 400,
                message: "Account with this account number already exists"
            });
        }
        const newAccount = await pool.query({
            text : 'INSERT INTO tblaccount (account_name , account_balance , account_number , user_id , createdat , updatedat) VALUES ($1 , $2 , $3 , $4 , CURRENT_TIMESTAMP , CURRENT_TIMESTAMP) RETURNING *',
            values: [name , amount , account_number , userId]})
       
        const account = newAccount.rows[0];
        const userAccounts = Array.isArray(name) ? name : [name];

        const updateUserAccounts = await pool.query({
            text : 'UPDATE tbluser SET accounts = array_cat(accounts , $1) , updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            values: [userAccounts , userId]
        })

        // add initial deposit transaction
           const description = account.account_name + " - Initial Deposit";

           const initialDeposit = await pool.query({
            text : 'INSERT INTO tbltransaction (user_id , description , status , source , amount , type ) VALUES ($1 , $2 , $3 , $4 , $5 , $6 ) RETURNING *',
            values: [userId , description , 'Completed' , account.account_name , amount , 'income' ]
           });

            res.status(201).json({
            status: 201,
            message: "Account created successfully",
            data: newAccount.rows[0]
        });
         
    }catch (error){
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

    export const addMoneyToAccount = async (req , res) =>{
        try {
               const {id} = req.params;
        const { amount } = req.body;
        const userId = req.user.userId;

        const newAmount = Number(amount);
        const accountExists = await pool.query('SELECT * FROM tblaccount WHERE id = $1 AND user_id = $2', [id , userId]);
        if(accountExists.rows.length === 0){
            return res.status(404).json({
                status: 404,
                message: "Account not found"
            });
        }
        console.log("ID =", id);
console.log("User ID =", userId);
console.log("Existing account =", accountExists.rows);
console.log("Existing balance =", accountExists.rows[0]?.account_balance);
console.log("New Amount =", newAmount);


      const updatedAmount =
  Number(accountExists.rows[0].account_balance) + Number(newAmount);

const finalAmount = Number(updatedAmount.toFixed(2));

        const updateAccount =  await pool.query({
            text : 'UPDATE tblaccount SET account_balance = $1 , updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            values: [finalAmount , id]
        });
        console.log("Computed updatedAmount =", updatedAmount);
        console.log("Update rowCount =", updateAccount.rowCount);
        console.log("Updated row =", updateAccount.rows[0]);

        const accountInfo = updateAccount.rows[0];
        const description = accountInfo.account_name + " - Added Money";
        const addMoneyTransaction = await pool.query({
            text : 'INSERT INTO tbltransaction (user_id , description , status , source , amount , type ) VALUES ($1 , $2 , $3 , $4 , $5 , $6 ) RETURNING *',
            values: [userId , description , 'Completed' , accountInfo.account_name , newAmount , 'income' ]
              });
              res.status(200).json({
            status: 200,
            message: "Money added to account successfully",
            data: updateAccount.rows[0]
        });
        }catch (error){
            console.log(error);
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            });
        }
    }