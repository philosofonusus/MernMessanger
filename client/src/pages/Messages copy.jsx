import React, { useState, useEffect } from 'react';
import { Route } from "react-router-dom"

// Components
import Sidebar from "../components/layouts/Sidebar"
import Conversation from "../components/group-conversation/conversation.g"
import CreateGroup from "../components/modals/createGroup/createGroup"

const Messages = ({ auth, group, history, ...props }) => {

   const [state, setState] = useState({
      createGroup: false,
      activeConversation: null
   })

   const _setState = payload => setState({ ...state, ...payload })

   // Methods
   const initialize = () => {
      if (!auth.initializing && !auth.isAuth) {
         history.replace("/auth/login")
      } else if (!auth.initializing && auth.isAuth) {
         props.fetchGroupsList(auth.currentUser._id)
      }
   }
   const createGroup = async payload => {
      let group = {
         ...payload,
         members: [{ _id: auth.currentUser._id, type: "Admin" }],
         messages: [{
            message: `${auth.currentUser.name} has created the group`,
            sendBy: auth.currentUser._id,
            sentAt: Date.now()
         }],
         seenBy: [auth.currentUser._id],
         createdAt: Date.now(),
         createdBy: auth.currentUser._id
      }
      try {
         let res = await Api.post("/chat/group", group)
         setState({ ...state, createGroup: false })
         props.fetchGroupsList(auth.currentUser._id)
      } catch (error) { console.log(error.response); }
   }

   return (
      <div className="messages d-flex">
         {!auth.initializing &&
            <>
               <Sidebar
                  items={group.groups}
                  user={auth.currentUser}
                  setState={_setState}
                  activeConversation={state.activeConversation}
               />
               <Route
                  path="/messages/g/:_id"
                  render={(props) =>
                     <Conversation {...props}
                        activeConversation={id => { setState({ ...state, activeConversation: id }) }}
                        user={auth.currentUser}
                     />}
               />
            </>
         }
         {/* Models */}
         {state.createGroup && <CreateGroup done={createGroup} setState={_setState} />}
      </div>
   )
}

export default Messages