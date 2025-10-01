import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
    return (
        <div className='flex items-center justify-between py-3 gap-4 '>
            <img src={assets.logo} alt="" width={150} />
            <p className='flex-1  pl-4 text-sm text-gray-500 mx:hidden'>Copyright @Mahi.dev | All right reserved</p>
            <div className='flex gap-2.5'>
                <img src={assets.facebook_icon} width={35} alt="" />
                <img src={assets.instagram_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
            </div>
            
        </div>
    );
}

export default Footer;
