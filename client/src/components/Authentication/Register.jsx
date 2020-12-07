import React, { useState, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext"

// Components
import TextField from "../custom/TextField/TextFiled"
import Button from "../custom/Button/Button"
//import { CircularProgress } from "@material-ui/core"
//const STATIC_SRC = "https://i.ibb.co/WWbGCkf/gallery.png"

const Register = ({ onActiveChange }) => {

   const { socket } = useContext(AuthContext)

   const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      repeatPassword: ""
   })

   const [errors, setErrors] = useState({
      name: false,
      email: false,
      password: false,
      repeatPassword: false
   })

   const handleRegister = () => {
      if (isValid() && socket) {
         console.log("valid");
         socket.emit('register', {
            name: form.name,
            email: form.email,
            password: form.password
         }, res => {
            console.log(res);
         })
      } else {
         console.log('not valid or socket error');
      }
   }

   const isValid = () => {
      let { name, email, password, repeatPassword } = form
      // Name
      if (name.trim() === "") {
         setErrors({ ...errors, name: "Name cann't leave empty!" })
         return false
      } else { setErrors({ ...errors, name: false }) }
      // Email
      if (email.trim() === "") {
         setErrors({ ...errors, email: "Email cann't leave empty!" })
         return false
      } else { setErrors({ ...errors, email: false }) }
      // Repeat password
      if (password.trim() !== repeatPassword.trim()) {
         setErrors({ ...errors, repeatPassword: "Password doesn't match" })
         return false
      } else { setErrors({ ...errors, repeatPassword: false }) }
      // Password
      if (password.trim() === "") {
         setErrors({ ...errors, password: "Password cann't leave empty!" })
         return false
      } else { setErrors({ ...errors, password: false }) }

      return true
   }

   return (
      <div className="register">
         <div className='text-center py-5'>
            <h2 className='mb-3 font-normal'>Register</h2>
            <p className='txt-sec'>Create your messenger account</p>
         </div>
         {/* <div className="group-image pos-rel mx-auto">
            <img className="w-100 h-100p circle to-center" src={STATIC_SRC} />
            <div className='pos-abs to-center'><CircularProgress color="secondary" /></div> :
               <div className="inner-overlay to-center circle pos-abs w-100 h-100p">
               <input name="image" className='pos-abs pointer wh-100' type="file" accept="image/*" />
               <i className="fal fa-camera fa-lg pos-abs to-center text-white" />
            </div>
         </div> */}
         <div className='form my-10'>
            <div className='mb-2'>
               <TextField pill white
                  label="Full Name"
                  hint="Enter your Name"
                  value={form.name}
                  error={errors.name}
                  onChange={v => setForm({ ...form, name: v })}
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  label="Email address"
                  hint="Enter your email address"
                  value={form.email}
                  error={errors.email}
                  onChange={v => setForm({ ...form, email: v })}
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  type="password"
                  label="Password"
                  hint="Enter your password"
                  value={form.password}
                  error={errors.password}
                  onChange={v => setForm({ ...form, password: v })}
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  type="password"
                  label="Confirm password"
                  hint="Enter password again"
                  value={form.repeatPassword}
                  error={errors.repeatPassword}
                  onChange={v => setForm({ ...form, repeatPassword: v })}
               />
            </div>
         </div>
         <div className='py-5 pb-10'>
            <div className='mb-4'>
               <Button onClick={handleRegister} pill w100 color='teal'>Register</Button>
            </div>
            <Button
               onClick={() => onActiveChange("LOGIN")}
               pill w100 outlined color='teal'
            >
               login here
            </Button>
         </div>
      </div>
   )
}

export default Register;
