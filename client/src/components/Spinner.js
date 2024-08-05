import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Spinner = () => {
    const [count,setCount]=useState(3);
    const navigate=useNavigate();//to navigate to login page
    useEffect(()=>{
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue);//yaha pr har 1sec mai count 1 kam hora
          }, 1000);
          count===0 && navigate('/login');
          //if count ==0 then navigate to login page
          return ()=> clearInterval(interval);


    },[count,navigate])


  return (
    <>
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <h1 className="Text-center">redirecting to you in {count} second </h1>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  </>  )
}

export default Spinner