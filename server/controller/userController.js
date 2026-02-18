import pool from '../libs/database.js';
import { comparePassword , hashPassword } from './index.js';

export const getUser = async (req , res) =>{
    try {
        const userId = req.user.userId;
        const userExists = await pool.query('SELECT * FROM tbluser WHERE id = $1', [userId]);
        if(userExists.rows.length === 0){
            return  res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        userExists.rows[0].password = undefined;
        res.status(200).json({
            status: 200,
            message: "User retrieved successfully",
            data: 
            userExists.rows[0]
        });

    }catch (error){
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

export const updateUser = async (req , res) =>{
    
    try {
        const userId = req.user.userId;
    const {firstname , lastname , contact , currency , country} = req.body;

    const userExists = await pool.query('SELECT * FROM tbluser WHERE id = $1', [userId]);
    if(userExists.rows.length === 0){
        return  res.status(404).json({
            status: 404,
            message: "User not found"
        });
    }
    const updateUser = await pool.query({
        text : 'UPDATE tbluser SET firstName = $1 , lastName = $2 , contact = $3 , currency = $4 , country = $5  , updatedat = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        values: [firstname , lastname , contact , currency , country , userId]
    });
    updateUser.rows[0].password = undefined;
    res.status(200).json({
        status: 200,
        message: "User updated successfully",
        data: updateUser.rows[0]
    });
    }catch (error){
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

export const changePassword = async (req , res) =>{
    try {
        const userId = req.user.userId;
        const { currentPassword , newPassword  , confirmPassword } = req.body;
        if(!currentPassword || !newPassword || !confirmPassword){
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                status: 400,
                message: "New password and confirm password do not match"
            });
        }
        const user = await pool.query('SELECT * FROM tbluser WHERE id = $1', [userId]);
        if(user.rows.length === 0){
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        const isMatch = await comparePassword(currentPassword , user.rows[0].password);
        console.log("DB PASSWORD:", user.rows[0].password);

        if(!isMatch){
            return res.status(401).json({
                status: 401,
                message: "Current password is incorrect"
            });
        }
        const hash = await hashPassword(newPassword);
        await pool.query('UPDATE tbluser SET password = $1 WHERE id = $2', [hash , userId]);
        res.status(200).json({
            status: 200,
            message: "Password changed successfully"
        });

    }catch (error){
        console.log(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

// export const loginUser = async (req , res) =>{
//     try {
//     }catch (error){
//         res.status(500).json({
//             status: 500,
//             message: "Internal Server Error"
//         });
//     }
// }