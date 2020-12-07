import React, { useContext } from 'react';
import { MessageContext } from "../context/MessageContext"

const FriendsList = () => {

   const { friends } = useContext(MessageContext)

   return (
      <div className='sb-frnds-list h-100p'>
         {friends && friends.map(user => (
            <div key={user._id} className='d-flex px-5 py-3'>
               <img src={user.thumbnail} className='thumbnail circle' alt="User thumbnail" />
               <div className='pl-5'>
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
               </div>
            </div>
         ))}
      </div>
   );
}

export default FriendsList;
