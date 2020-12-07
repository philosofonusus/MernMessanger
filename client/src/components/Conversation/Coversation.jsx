import React from 'react';

// Components
import Header from "../layouts/Header"

const Coversation = () => {
   return (
      <div className='conversation w-100 d-flex fd-col'>
         <Header name="Anik" thumbnail="dawk;lejawe" />
         <div className='gc-wrapper d-flex'>
            <div className='w-100 d-flex fd-col'>
               <div className='h-100p conversation overflow-hidden'>
                  {/* <div id='scroll-to-bottom' onScroll={handleScroll} className="hidden-scrollbar pl-5"> */}
                  {/* <Messages messages={messages} userId={user._id} /> */}
                  {/* </div> */}
               </div>
               <div className='bottom-message-bar d-flex px-5 py-4'>
                  <i className="icon-btn-3 to-center-before circle pointer pos-rel mr-3 fal fa-image" />
                  <input
                     //onChange={handleChange}
                     //onKeyPress={handleKeyPress}
                     //value={message}
                     className="w-100 px-6 py-3"
                     type="text"
                     placeholder="Write your message"
                  />
               </div>
            </div>
            {/* <RightBar _id={user._id} members={group.members} activeP={state.rightBarActive} /> */}
         </div>
      </div>
   );
}

export default Coversation;
