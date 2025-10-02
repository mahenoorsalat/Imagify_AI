import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }
};

const userCredits = async(req , res)=>{
try{
    const userId = req.user.id;
  const user = await userModel.findById(userId);
  res.json({success:true , credits:user.creditBalance , user:{name:user.name}})

}catch(error){
  console.log(error)
  res.json({success:false , message: error.message})
}
}

const razorpayInstance = new razorpay({
  key_id : process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req, res) => {
  try {
    const userId = req.user.id; // from userAuth middleware
    const { planId } = req.body;

    const user = await userModel.findById(userId);

    if (!user || !planId) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let credits, plan, amount;

    switch (planId) {
      case 'Basic':
        plan = "Basic";
        credits = 100;
        amount = 50;
        break;
      case 'Advanced':
        plan = "Advanced";
        credits = 500;
        amount = 100;
        break;
      case 'Business':
        plan = "Business";
        credits = 5000;
        amount = 300;
        break;
      default:
        return res.json({ success: false, message: "Plan not found" });
    }

    const date = Date.now();

    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date,
    };

    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req  , res)=>{
  try{
    const {razorpay_order_id} = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderInfo.status === "paid"){
      const transactionData = await transactionModel.findById(orderInfo.receipt)
      if(transactionData.payment){
        return res.json({success:false , message : "payment Failed"})
      }
      const userId = req.user.id;
const userData = await userModel.findById(userId);

      const creditBalance = userData.creditBalance + transactionData.credits
      await userModel.findByIdAndUpdate(user._id , {creditBalance})
      await transactionModel.findByIdAndUpdate(transactionData._id , {payment: true})
      res.json({success: true , message : "credits added"})
    }
    else{
      res.json({success: false , message : "Payment Failed"}) 
    }
  }
  catch(error){
          res.json({success: false , message : error.message}) 

  }
}

export { registerUser, loginUser , userCredits , paymentRazorpay , verifyRazorpay };
