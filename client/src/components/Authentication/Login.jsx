import React, { useState } from 'react';

// Components
import TextField from "../custom/TextField/TextFiled"
import Button from "../custom/Button/Button"

const Login = ({ onActiveChange, onForgotPass, handleLoading, history, onLogin }) => {

   const [email, setEmail] = useState("rk@anik.com")
   const [password, setPassword] = useState("123456")
   const [emailError, setEmailError] = useState(false)
   const [passError, setPassError] = useState(false)
 
   const handleLogin = () => {
      handleLoading(true)
      if (isValid()) { onLogin({ email, password }) }
   }

   const isValid = () => {
      if (email.trim() === "") {
         setEmailError("Email cann't be blank")
         return false
      } else { setEmailError(false) }

      if (password.trim() === "") {
         setPassError("Password cann't be blank")
         return false
      } else { setPassError(false) }
      return true
   }

   return (
      <div className="login">
         <div className='text-center py-5'>
            <h2 className='mb-3 font-normal'>Signin</h2>
            <p className='txt-sec'>Signin with your email and password</p>
         </div>
         <div className='form mt-10 mb-5'>
            <div className='mb-2'>
               <TextField pill white
                  value={email}
                  error={emailError}
                  type='email'
                  label="Email address"
                  hint="Email address"
                  onChange={v => setEmail(v)}
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  value={password}
                  error={passError}
                  type="password"
                  label="Password"
                  hint="Enter password"
                  onChange={v => setPassword(v)}
               />
            </div>
            <p onClick={onForgotPass} className='forgot-pass ta-r pointer'>Forgot password?</p>
         </div>
         <div className='py-5 pb-10'>
            <div className='mb-4'>
               <Button onClick={handleLogin} pill w100 color='teal'>login</Button>
            </div>
            <Button onClick={() => onActiveChange("REGISTER")} pill w100 outlined color='teal'>Create account</Button>
         </div>
      </div>
   );
}

export default Login;
