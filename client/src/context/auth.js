import axios from "axios";
import { useState,useEffect ,useContext, createContext} from "react";
const AuthContext=createContext();



const AuthProvider=(props)=>{
//isko hi manage krna hai globally
const[auth,setAuth]=useState({
    user:null,
    token:""
});
//default axios
axios.defaults.headers.common['Authorization']=auth?.token;

//local storage se auth ki value dalre
useEffect(()=>{
//auth variable access kr rhe localstorage se
    const data=localStorage.getItem('auth');
if(data){
    const parseData=JSON.parse(data);
    setAuth({
        ...auth,
        user:parseData.user,
        token:parseData.token,
    })
}
//eslint-disable-next-line
},[])


return (
    <AuthContext.Provider value={[auth,setAuth]}>
        {props.children}
    </AuthContext.Provider>
)

}
//custom hook

const useAuth=()=>useContext(AuthContext);
export {useAuth,AuthProvider}


