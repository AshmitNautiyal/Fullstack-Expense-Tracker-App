import pool from '../libs/database.js';
import { hashPassword  , comparePassword , createJWT} from './index.js';

export const signupuser = async (req , res) =>{
    try {
        const { firstName, email, password } = req.body;
        if(!firstName || !email || !password){
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }
        const existingUser = await pool.query('SELECT * FROM tbluser WHERE email = $1', [email]);
        if(existingUser.rows.length > 0){
            return res.status(409).json({
                status: 409,
                message: "User already exists"
            });
        }
        const hash = await hashPassword(password);
        const user  = await pool.query({
            text: 'INSERT INTO tbluser (firstName, email, password) VALUES ($1, $2, $3) RETURNING *',
            values: [firstName, email, hash]
        });
        user.rows[0].password = undefined;
        res.status(201).json({
            status: 201,
            message: "User created successfully",
            user: user.rows[0]
        });
    }catch (error){
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

export const loginUser = async (req , res) =>{
    try {
        const { email , password }  = req.body;
        if(!email || !password){
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }
        const user = await pool.query('SELECT * FROM tbluser WHERE email = $1', [email]);
        if(user.rows.length === 0){
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        const isMatch = await comparePassword(password, user.rows[0].password);
        if(!isMatch){
            return res.status(401).json({
                status: 401,
                message: "Invalid credentials"
            });
        }
        const token = createJWT(user.rows[0].id);

        user.rows[0].password = undefined;
        res.status(200).json({
            status: 200,
            message: "Login successful",
            user: user.rows[0],
            token
        });
    }catch (error){
        console.error("LOGIN ERROR:", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}

