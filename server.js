import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import db from './config/db.js';
import router from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = 3000;
db();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});     

app.use('/api/auth',router)
app.use('/api/user',userRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
