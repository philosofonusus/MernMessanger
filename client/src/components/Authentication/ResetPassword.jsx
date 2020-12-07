import React from 'react';

// Components
import Button from "../custom/Button/Button"
import TextField from "../custom/TextField/TextFiled"

const ResetPassword = ({ onActiveChange }) => {
   return (
      <div className='forgot-password'>
         <div className='text-center py-5'>
            <h2 className='mb-3 font-normal'>Reset Password</h2>
            <p className='txt-sec'>Give your email and reset your password</p>
         </div>
         <div className="form my-10">
            <div className='mb-2'>
               <TextField pill white
                  label="Email address"
                  hint="Email address"
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  type="password"
                  label="New Password"
                  hint="New password"
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  type="password"
                  label="Confirm"
                  hint="Confirm new password"
               />
            </div>
         </div>
         <Button pill w100 color='teal'>Reset</Button>
         <div className="actions d-flex my-4">
            <div className='w-100 mr-2'>
               <Button
                  onClick={() => onActiveChange('LOGIN')}
                  pill w100 outlined color='orange'>Login
                </Button>
            </div>
            <div className='w-100 ml-2'>
               <Button
                  onClick={() => onActiveChange('REGISTER')}
                  pill w100 outlined color='pink'>Register
               </Button>
            </div>
         </div>
      </div>
   );
}

export default ResetPassword;
