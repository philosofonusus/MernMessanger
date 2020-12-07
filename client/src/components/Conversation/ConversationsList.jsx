import React, { useContext } from 'react';

// Contexts
import { AuthContext } from "../../context/AuthContext"
import { MessageContext } from "../../context/MessageContext"

// Components
import ConversationsListItem from "./ConversationsListItem"

const ConversationsList = () => {

   const { currentUser, socket, accessToken } = useContext(AuthContext)
   const { conversations } = useContext(MessageContext)

   return (
      <div className='conversations h-100p text-white'>{
         conversations.map(({ _id, name, thumbnail, messages, type }) => (
            <ConversationsListItem
               key={_id}
               id={_id}
               name={name}
               type={type}
               thumbnail={thumbnail}
               message={messages[0]}
               userId={currentUser._id}
               socket={socket}
               token={accessToken}
            />
         ))
      }</div>
   );
}

export default ConversationsList;
