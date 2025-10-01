import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify';


const Login = () => {

  const [state, setState] = useState('Login');
  const { setShowLogin, setUser, backendUrl, setToken } = useContext(AppContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + '/api/user/login', {email , password} , {headers:  { "Content-Type": "application/json" }})

        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.getItem('token', data.token)
          setShowLogin(false)
         
          console.log(data)

        } else {
          toast.error(data.message)
        }
       
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/register',{name , email,password} , {headers:  { "Content-Type": "application/json" }})
        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
          console.log(data)

        } else {
          toast.error(data.message)
        }

        setShowLogin(false)
        setUser(true)
      }
    }
    catch (error) {
      toast.error(error.message)
    }
  }
  const isLogin = state === 'Login';
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className='fixed inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='bg-white relative p-10 rounded-xl text-slate-500 w-full max-w-md'>
        {/* Heading */}
        <h1 className='text-center text-2xl text-neutral-700 font-medium mb-2'>
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <p className='text-center text-sm mb-5'>
          {isLogin
            ? 'Welcome back! Please login to continue'
            : 'Create a new account to get started'}
        </p>

        {/* Full Name field only for Sign Up */}
        {!isLogin && (
          <div className='px-4 py-2 flex items-center gap-2 rounded-full border border-gray-300 mb-4'>
            <img src={assets.profile_icon} alt="user" className='w-5 h-5' />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className='outline-none text-sm flex-1'
              placeholder='Full Name'
              required
            />
          </div>
        )}

        {/* Email */}
        <div className='px-4 py-2 flex items-center gap-2 rounded-full border border-gray-300 mb-4'>
          <img src={assets.email_icon} alt="email" className='w-5 h-5' />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}

            type="email"
            className='outline-none text-sm flex-1'
            placeholder='Email Id'
            required
          />
        </div>

        {/* Password */}
        <div className='px-4 py-2 flex items-center gap-2 rounded-full border border-gray-300 mb-4'>
          <img src={assets.lock_icon} alt="lock" className='w-5 h-5' />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className='outline-none text-sm flex-1'
            placeholder='Password'
            required
          />
        </div>

        {/* Forgot Password link only for Login */}
        {isLogin && (
          <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password?</p>
        )}

        {/* Submit Button */}
        <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition'>
          {isLogin ? 'Login' : 'Create Account'}
        </button>

        {/* Toggle Login/Sign Up */}
        <p className='mt-5 text-center'>
          {isLogin
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            onClick={() => setState(isLogin ? 'Sign Up' : 'Login')}
            className='text-blue-600 cursor-pointer'
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>

        {/* Close icon */}
        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" className='absolute top-5 right-5 cursor-pointer' />
      </motion.form>
    </div>
  );
}

export default Login;
