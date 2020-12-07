import React, { useContext, useEffect } from 'react';
import { AuthContext, initState } from "../context/AuthContext"
import { MessageContext } from "../context/MessageContext"

// Router
import { Switch, Route } from "react-router-dom"

// Components
import Settings from "../components/Settings"
import Sidebar from "../components/layouts/Sidebar"
import Conversation from "../components/Conversation/Coversation"

const Messages = ({ history }) => {

   const { socket, currentUser, isAuth, setState, accessToken, resetState } = useContext(AuthContext)
   const { setMessageState } = useContext(MessageContext)

   // Verifing Access Token
   useEffect(() => {
      if (socket && accessToken) {
         socket.emit("verifyToken", accessToken, ({ error }) => {
            if (error) {
               resetState(initState)
               return history.replace("/authenticate")
            }
            setState({ isAuth: true })
         })
      }
   }, [accessToken, socket, setState, resetState, history])

   // Is auth then getting informations
   useEffect(() => {
      if (isAuth && accessToken && socket) {
         let select = ['name', 'email', 'thumbnail']

         socket.emit("getUserFromToken", { token: accessToken, select, now: Date.now() }, ({ error, user }) => {
            !error && setState({ currentUser: user })
         })

         socket.emit("getConversations", accessToken, ({ error, conversations }) => {
            if (!error) {
               setMessageState({ conversations })
            }
         })

         socket.emit("getFriendsList", accessToken, ({ error, friends, message }) => {
            console.log(error, friends, message)
            if (!error) {
               setMessageState({ friends })
            }
         })
      }
   }, [isAuth, accessToken, socket, setState, setMessageState])

   return (
      <div className="messages d-flex">
         <Sidebar user={currentUser} />
         <Switch>
            <Route path="/messages/settings" component={Settings} exact />
            <Route path="/messages/:convId" render={(props) => <Conversation {...props} />} exact />
         </Switch>
      </div>
   )
}

export default Messages