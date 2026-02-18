import pool from  '../libs/database.js';
import {getMonthName} from './index.js';

export const getTransactions = async (req , res) =>{
    try {
        const today = new Date();
        const _sevenDaysAgo = new Date(today);
        _sevenDaysAgo.setDate(today.getDate() - 7);
        const sevenDaysAgo = _sevenDaysAgo.toISOString().split('T')[0];

        const {df , dt , s} = req.query;
        const userId = req.user.userId;

        // Start date (beginning of the day)
    const startDate = df ? new Date(df + "T00:00:00") : new Date(sevenDaysAgo + "T00:00:00");

    // End date (end of the day)
    const endDate = dt
      ? new Date(dt + "T23:59:59")
      : new Date(today.toISOString().split("T")[0] + "T23:59:59");

         const transactions = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 AND (description ILIKE '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%') ORDER BY id DESC`,
      values: [userId, startDate, endDate, s],

    });

    res.status(200).json({
      status: "success",
      data: transactions.rows,
    });

    }catch (error){
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

export const addTransaction = async (req , res) =>{
    try {
        const userId = req.user.userId;
        const accountId = req.params.accountId;
        const {amount , description , source } = req.body;

        if (!amount || !description || !source){
            return  res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }
        if (isNaN(amount) || Number(amount) <= 0){
            return  res.status(400).json({
                status: 400,
                message: "Amount must be a positive number"
            });
        }
        const getAccount = await pool.query({
            text: `SELECT * FROM tblaccount WHERE id = $1`,
            values: [accountId]    
        });
        if (getAccount.rowCount === 0){
            return  res.status(404).json({
                status: 404,
                message: "Account not found"
            });
        }
        const accountInfo = getAccount.rows[0];
        if (accountInfo.user_id !== userId){
            return  res.status(403).json({
                status: 403,
                message: "You are not authorized to perform this action"
            });
        }
        if(accountInfo.account_balance < Number(amount) || accountInfo.account_balance <= 0){
            return  res.status(400).json({
                status: 400,
                message: "Insufficient account balance"
            });
        }
        const newBalance = accountInfo.account_balance - Number(amount);
        await pool.query('BEGIN');
        await pool.query({
            text: `UPDATE tblaccount SET account_balance = $1 , updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
            values: [newBalance, accountId]
        });
        await pool.query({
            text: `INSERT INTO tbltransaction (user_id,  amount, description, type, status, source) VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [userId, amount, description, "expense", "Completed", source]})
        await pool.query('COMMIT');
        res.status(200).json({
            status: 200,
            message: "Transaction added successfully"
        });
    }catch (error){
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

export const transferMoney = async (req , res) =>{
    try {
        const userId = req.user.userId;
        const { fromAccount , toAccount , amount } = req.body;
        if (!fromAccount || !toAccount || !amount){
            return  res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }
        if (isNaN(amount) || Number(amount) <= 0){
            return  res.status(400).json({
                status: 400,
                message: "Amount must be a positive number"
            });
        }
        const newAmount = Number(amount);
        const getFromAccount = await pool.query({
            text: `SELECT * FROM tblaccount WHERE id = $1`,
            values: [fromAccount]
        });
        if (getFromAccount.rowCount === 0){
            return  res.status(404).json({
                status: 404,
                message: "From Account not found"
            });
        }
        if(newAmount > getFromAccount.rows[0].account_balance){
            return  res.status(403).json({
                status: 403,
                message: "Transfer failed. Insufficient account balance"
            });
        }
        await pool.query('BEGIN');
         await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, fromAccount],
    });

    // Transfer to account
    const ToAccount = await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [newAmount, toAccount],
    });
const fromAccountName = getFromAccount.rows[0].account_name;
const toAccountName = ToAccount.rows[0].account_name;
    // Insert transaction records
    const description = `Transfer (${fromAccountName} - ${toAccountName})`;
      await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [
        userId,
        description,
        "transfer",
        "Completed",
        amount,
        fromAccountName,
      ],
    });

    const description1 = `Received (${fromAccountName} - ${toAccountName})`;

    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [
        userId,
        description1,
        "Received",
        "Completed",
        amount,
        toAccountName,
      ],
    });

    // Commit transaction
    await pool.query("COMMIT");

    res.status(201).json({
      status: "success",
      message: "Transfer completed successfully",
    });
        
    }catch (error){
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

export const getDashboardTransactions = async (req , res) =>{
    try {
        const userId = req.user.userId;
        let totalIncome = 0;
        let totalExpense = 0;

        const transactionsResult = await pool.query({
            text: `SELECT type, SUM(amount) as totalAmount FROM tbltransaction WHERE user_id = $1 GROUP BY type`,
            values: [userId]
        });
        transactionsResult.rows.forEach(row => {
            if (row.type === 'income') {
                totalIncome += parseFloat(row.totalamount);
            } else if (row.type === 'expense') {
                totalExpense += parseFloat(row.totalamount);
            }
        });

          const availableBalance = Number(totalIncome) - Number(totalExpense);

    // Aggregate transactions to sum by type and group by month
    const year = new Date().getFullYear();
    const start_Date = new Date(year, 0, 1); // January 1st of the year
    const end_Date = new Date(year, 11, 31, 23, 59, 59); // December 31st of the year

    const result = await pool.query({
      text: `
      SELECT 
        EXTRACT(MONTH FROM createdat) AS month,
        type,
        SUM(amount) AS totalAmount 
      FROM 
        tbltransaction 
      WHERE 
        user_id = $1
        AND type != 'transfer' AND type != 'Received'
        AND createdat BETWEEN $2 AND $3 
      GROUP BY 
        EXTRACT(MONTH FROM createdat), type`,
      values: [userId, start_Date, end_Date],
    });

    //   organise data

    const data = new Array(12).fill().map((_, index) => {
      const monthData = result.rows.filter(
        (item) => parseInt(item.month) === index + 1
      );

      const income =
        monthData.find((item) => item.type === "income")?.totalamount || 0;

      const expense =
        monthData.find((item) => item.type === "expense")?.totalamount || 0;

      return {
        label: getMonthName(index),
        income,
        expense,
      };
    });

    // Fetch last transactions
    const lastTransactionsResult = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY id DESC LIMIT 5`,
      values: [userId],
    });

    const lastTransactions = lastTransactionsResult.rows;

    // Fetch last accounts
    const lastAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY id DESC LIMIT 4`,
      values: [userId],
    });

    const lastAccount = lastAccountResult.rows;

    res.status(200).json({
      status: "success",
      availableBalance,
      totalIncome,
      totalExpense,
      chartData: data,
      lastTransactions,
      lastAccount,
    });
    }catch (error){
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}