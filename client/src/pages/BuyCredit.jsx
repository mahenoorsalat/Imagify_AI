import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const BuyCredit = () => {
  const { user, backendUrl, loadCreditsData, token, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()
 const initPay = async (order) =>{
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
    amount: order.amount, 
    currency: order.currency,
    name: "Credits Payment", 
    description: "Credit Payment",
    order_id:order.id, 
    // callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
    receipt : order.receipt , 
    handler : async (response)=>{
      try{
        const {data} = await axios.post(backendUrl + '/api/user/verify-razor' , response , {headers : {token}})
        if(data.success){
          loadCreditsData()
          navigate('/')
          toast.success("credits added")
           console.log(data)
        }
       
        
      }catch(error){
        toast.error(error.message)
      }
    }
  
};
const rzp = new window.Razorpay(options)
rzp.open()
 }
  const paymentRazorpay = async (planId) =>{
   try {
    if(!user){
      setShowLogin(true)
    }

// Before sending request
const headers = token ? { Authorization: `Bearer ${token}` } : {};
const { data } = await axios.post(backendUrl + '/api/user/pay-razor', { planId }, { headers });

    if(data.success){
      initPay(data.order)
    }
    console.log(data)
   } catch (error) {
    toast.error(error.message)
    
   }
  }


  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>
        Our Plans
      </button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>
        Choose the Plan
      </h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((Item, index) => (
          <div
            className='bg-white drop-shadow-sm  rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'
            key={index}
          >
            <img width={40} src={assets.logo_icon} alt="logo" />
            <p className='mt-3 mb-1 font-semibold'>{Item.id}</p>
            <p className='text-sm'>{Item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>${Item.price}</span> / {Item.credits}
            </p>
            <button onClick={()=>paymentRazorpay(Item.id)} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>{user ? 'Purchase' : 'Get Started'}</button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit
