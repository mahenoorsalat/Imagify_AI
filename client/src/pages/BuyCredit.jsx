import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import {motion} from 'framer-motion'

const BuyCredit = () => {
  const {user} = useContext(AppContext)
  return (
    <motion.div 
      initial={{opacity:0.2 , y:100}}
        transition={{duration:1}}
        whileInView={{opacity:1 , y:0}}
        viewport={{once:true}}
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
            <button className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>{user? 'Purchase':'Get Started'}</button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit
