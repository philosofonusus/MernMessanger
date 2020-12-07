import React from 'react'

// Components
import TextField from "../components/custom/TextField/TextFiled"

export const Builder = () => {

   const onChange = v => console.log(v);

   return (
      <div className='pa-10'>
         <h1>Builder</h1>
         <TextField
            pill light
            value="Username"
            onChange={onChange}
         />
      </div>
   )
}
