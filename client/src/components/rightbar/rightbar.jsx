import React, { useState, useEffect } from 'react';
import "./rightbar.scss"

// Components
import Addfriend from "../addfriend/addFriend"

const Rightbar = ({ _id, members, activeP }) => {

   const [active, setActive] = useState(null)
   useEffect(() => {
      console.log("RB -A");
      setActive(activeP || active)
   }, [active])

   return (
      <>
         <div className={`expandable overflow-hidden pos-rel ${active && 'active'}`}>
            {active === 'AddFriend' && <Addfriend closeExpandle={() => setActive(null)} />}
         </div>
         <div className="right-sidebar">
            <div className="actions py-2 px-3 d-flex fd-col">
               <i className="i-icon-btn fal fa-info-circle" />
               <i className="i-icon-btn fal fa-plus" />
               <i
                  onClick={() => setActive('Friends')}
                  className="i-icon-btn fal fa-user-friends"
               />
            </div>
            <div className='members px-3 py-3'>
               {members && members.map(member => (
                  member._id !== _id &&
                  < div key={member._id} className='member my-2' >
                     <img className='circle wh-100' src={member.thumbnail} alt={member.thumbnail} />
                     {
                        member.active &&
                        <div className='active-dot pos-abs circle'>
                           <div className='dot pos-abs circle to-center' />
                        </div>
                     }
                  </div>
               ))}
            </div>
         </div>
      </>
   );
}

export default Rightbar;