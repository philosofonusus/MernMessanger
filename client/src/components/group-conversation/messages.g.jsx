import React from 'react';
import "./_messages.g.scss"

const GMessages = ({ messages, userId }) => {
   return (<>
      {messages.map(({ message, sendBy, ...rest }, i) =>
         <div className='d-flex w-100 my-2' key={i}>
            {sendBy === userId && <div className="spacer"></div>}
            {sendBy === userId
               ? <p className='message px-4 py-2 bg-blue text-white mr-5'>{message}</p>
               : <div>
                  {rest.userName &&
                     <div className='d-flex py-1 mb-1 ml-1'>
                        <img className='user-thumbnail circle' src={rest.thumbnail} alt="" />
                        <p className='userName ml-1'>{rest.userName}</p>
                     </div>}
                  <p className='message ml-6 px-4 py-2 bg-grey'>{message}</p>
               </div>
            }
         </div>
      )}
   </>)
}
export default GMessages;
