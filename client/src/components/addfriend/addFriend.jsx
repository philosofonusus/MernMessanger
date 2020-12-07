import React from 'react';
import "./addFriend.scss"

const AddFriend = ({ closeExpandle }) => {
   return (
      <div className='add-friend'>
         <div className="pa-3 pb-0">
            <i onClick={closeExpandle} className="pointer fal fa-times"></i>
         </div>
         <div className="pa-3">
            <input type="text" placeholder="Search friend" />
         </div>
      </div>
   );
}

export default AddFriend;
