import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';  
import routes from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-v1" , routes);

app.use((req , res) =>{
res.status(404).json({
  status: 404,
  message: "Routes not found"
});
})

app.listen(port , () => {
  console.log(`Server is running on port ${port}`);
})