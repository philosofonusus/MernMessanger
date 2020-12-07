import React, { useState } from 'react';

const BottomNavbar = ({ onChangeBottomNav }) => {

   const [active, setActive] = useState("CHATS")
   const classes = "switcher pointer w-100 text-center"

   const handleBottomChange = payload => {
      if (onChangeBottomNav) onChangeBottomNav(payload)
      setActive(payload)
   }

   return (
      <div className='bottom-navbar d-flex pa-5'>
         <div
            className={`${active === 'CHATS' && 'active'} ${classes}`}
            onClick={() => handleBottomChange("CHATS")}>
            <i className="fas fa-comments" />
         </div>
         <div
            className={`${active === 'FRIENDS' && 'active'} ${classes}`}
            onClick={() => handleBottomChange("FRIENDS")}>
            <i className="fal pointer fa-user-friends" />
         </div>
         <div
            className={`${active === 'GROUPS' && 'active'} ${classes}`}
            onClick={() => handleBottomChange("GROUPS")}>
            <i className="fal pointer fa-users" />
         </div>
      </div >
   );
}

export default BottomNavbar;