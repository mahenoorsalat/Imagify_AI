import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'

export const AppContext = createContext();


const AppContextProvider = (props) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [credit, setCredit] = useState(0)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } })
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)

            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const generateImage = async (prompt) =>{
        try{
         const {data} = await axios.post(backendUrl + '/api/image/generateImage' , {prompt} , {headers:{token}})
         if(data.success){
            loadCreditsData();
            return data.resultImage;
         }else{
            toast.error(data.message)
            loadCreditsData();
            if(data.creditBalance === 0){
                navigate('/buy')
            }
         }
         console.log(data)
        }catch(error){
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            loadCreditsData();
        }
    }, [token])

    const logout = () => {
        localStorage.removeItem('token');
        setToken('')
        setUser(null)
    }

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        credit,
        setCredit,
        token,
        setToken,
        loadCreditsData,
        logout , 
        generateImage
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;
