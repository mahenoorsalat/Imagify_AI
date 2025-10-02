import express from 'express';
import { loginUser, paymentRazorpay, registerUser, userCredits, verifyRazorpay } from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

// Use POST for register
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth , userCredits);
userRouter.post('/pay-razor', userAuth , paymentRazorpay);
userRouter.post('/verify-razor', userAuth , verifyRazorpay);





export default userRouter;


// http://localhost:4000api/user/register
// http://localhost:4000api/user/login
// http://localhost:4000api/user/credits


