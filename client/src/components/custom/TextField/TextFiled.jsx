import React, { useState, useEffect } from 'react';
import "./TextField.scss"

const TextFiled = ({ type, hint, label, rounded, pill, value, onChange, error, dark, ...rest }) => {

   const [text, setText] = useState(value || '')
   const handleChange = ({ target: { value } }) => {
      onChange ? onChange(value) : setText(value)
   }

   useEffect(() => {
      setText(value ? value : '')
   }, [value])

   const classes = [
      rounded && 'rounded',
      pill && 'pill',
      dark
         ? 'dark' : rest['light-teal']
            ? 'light-teal' : rest['white']
               ? 'white' : 'light',
   ]

   return (
      <div className={`custom-text-field ${error && 'error'}`}>
         {label && <><label>{label}</label><br /></>}
         <input
            type={type || 'text'}
            placeholder={hint || 'Enter your text here'}
            className={classes.filter(c => c).join(" ")}
            value={text}
            onChange={handleChange}
         />
         {error && <p className='desc'>{error}</p>}
      </div>
   )
}

export default TextFiled;