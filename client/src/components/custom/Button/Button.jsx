import React from 'react';
import "./Button.scss"

const Button = ({ pill, children, w100, color, outlined, onClick }) => {

   const classes = [
      'custom-button',
      pill && 'pill',
      w100 && 'w100',
      outlined && 'outlined',
      color
   ]

   return (
      <button
         className={classes.filter(e => e).join(" ")}
         onClick={onClick}
      >{children}
      </button>
   );
}

export default Button;