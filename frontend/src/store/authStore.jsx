/* eslint-disable no-unused-vars */
import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({

    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    message:null,

    signup:async(fullname, email, password) => 
    {
        set({isLoading:true, error:null});
        try{
            const response = await axios.post(`${API_URL}/signup`, {fullname, email, password});
            set({user:response.data.user, isAuthenticated:true, isLoading:false});
        }
        catch(error)
        {
            set({error:error.response.data.message || "Error signing up", isLoading: false})
            throw error;
        }
    },

    login:async(email, password)=>{
        set({isLoading:true, error:null});
        try{
            const response = await axios.post(`${API_URL}/signin`, {email, password});
            set({user:response.data.user, isAuthenticated:true, isLoading:false, error:null});
        }
        catch(error)
        {
            set({error:error.response?.data?.message || "Error Logging in", isLoading: false})
            throw error;
        }
    },

    logout:async()=>{
        set({isLoading:true, error:null});
        try{
            await axios.post(`${API_URL}/logout`);
            set({ user:null, isAuthenticated:false, error:null, isLoading:false});
        }
        catch(error)
        {
            set({ error:"Error Logging Out", isLoading: false})
            throw error;
        }
    },

    verifyEmail:async(code)=>{
        set({isLoading:true, error:null});
        try{
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({user:response.data.user, isAuthenticated:true, isLoading:false});
            return response.data;
        }
        catch(error)
        {
            set({error:error.response.data.message || "Error verifying email", isLoading: false})
            throw error;
        }
    },

    checkAuth:async()=>{
        set({isCheckingAuth:true, error:null});
        try{
            const response = await axios.get(`${API_URL}/check-auth`);
            set({user:response.data.user, isAuthenticated:true, isCheckingAuth:false});
        }
        catch(error)
        {
            set({error:null, isCheckingAuth:false,isAuthenticated:false})
        }
    }, 

    forgotPassword:async(email)=>{
        set({isLoading:true, error:null});
        try{
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({message:response.data.message, isLoading:false});
        }
        catch(error)
        {
            set({ isLoading: false, error:error.response.data.message || "Error sending reset password email "})
            throw error;
        }
    },

    resetPassword:async(token, password) => {
		set({ isLoading: true, error: null});
		try {
            console.log(`${API_URL}/reset-password/${token}`);
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	}

}));

export default useAuthStore;