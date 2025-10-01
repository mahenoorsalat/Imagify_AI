import userModel from "../models/userModel.js";
import FormData from 'form-data'
import axios from 'axios'

export const generateImage = async(req , res)=>{
try{
    // The previous error is fixed now that req.body is defined
    const { prompt } = req.body;
    const userId = req.user.id;
    const user = await userModel.findById(userId);

    if(!user || !prompt){
        return res.json({success: false , message : "User Not Authorized or Missing Prompt"});
    } 

    if(user.creditBalance === 0){
        return res.json({success:false , message : "No credit Balance " , creditBalance:user.creditBalance})
    }


    const clipDropApiKey = process.env.CLIPDROP_API ? process.env.CLIPDROP_API.trim() : null;

    if (!clipDropApiKey) {
        return res.json({ success: false, message: "CLIPDROP_API key is missing in .env file." });
    }

    const formData = new FormData();
    formData.append('prompt' , prompt)
    
    // Pass the form data and its headers correctly
    const formHeaders = formData.getHeaders();

   const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1' , formData , {
  
        headers:{ 
            ...formHeaders, 
            'x-api-key' : clipDropApiKey,
        },
        responseType:'arraybuffer'
    })

    const base64= Buffer.from(data , 'binary').toString('base64');
    const resultImage = `data:image/png;base64,${base64}`
    
    const newBalance = user.creditBalance - 1;
    await userModel.findByIdAndUpdate(user._id, { creditBalance: newBalance });

    return res.json({ success: true, message: "Image Generated", creditBalance: newBalance, resultImage });


}
catch(error){
    // Log the error for better debugging
    console.error("ClipDrop API Error:", error.message, error.response?.data?.toString());
    return res.json({success:false , message : `External API Error: ${error.message}`})
}
    
}
