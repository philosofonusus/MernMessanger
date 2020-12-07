import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContext"

const Settings = () => {

   const { currentUser } = useContext(AuthContext)

   return (
      <div className='settings pa-10 w-100'>
         <div className="d-flex">
            <div>
               <p className='label'>PREFERENCES</p>
               <ul>
                  <li>Profile</li>
                  <li>Active status</li>
               </ul>
            </div>
            <div className='ta-c'>

            </div>
         </div>
      </div>
   );
}

export default Settings;
