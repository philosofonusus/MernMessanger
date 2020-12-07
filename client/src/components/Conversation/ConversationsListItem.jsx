import React, { useState, useEffect } from 'react';
import moment from "moment"

import { Link } from 'react-router-dom'

const MS_IN_A_DAY = 86400000
//const MS_IN_A_HOUR = 3600000
//const MS_IN_A_MINUTE = 60000


const ConversationsListItem = ({ id, name, thumbnail, message, type, userId, socket, token }) => {
   const [lastMessage, setLastMessage] = useState("")
   const [initial, setInitial] = useState("")
   const [timeAgo, setTimeAgo] = useState("")

   // Generaing initial if no thumbnail
   useEffect(() => {
      if (!thumbnail) {
         let splitted = name.split(" ")
         let initial = splitted.length >= 2
            ? (splitted[0].charAt(0) + splitted[1].charAt()).toUpperCase()
            : name.substr(0, 2).toUpperCase()
         setInitial(initial)
      }
   }, [name, thumbnail])

   // Handle message change
   useEffect(() => {

      const fetchFrndName = async frndId => new Promise((res, rej) => {
         let data = { token, userId: frndId, select: ['name'] }
         socket.emit("getUser", data, ({ error, user }) => {
            if (error) return rej()
            res(user.name)
         })
      })
      const formatLastMessage = async () => {
         if (message.sendBy === userId) {
            if (message.type === 'TEXT') {
               setLastMessage(`You: ${message.text.substring(0, 24)}...`)
            }
            else if (message.type === "IMAGE") {
               setLastMessage('You sent a photo')
            }
         }
         else {
            let frndName = await fetchFrndName(message.by)
            setLastMessage(`${frndName}: ${message.text}`)
         }
      }
      const formatTimeAgo = () => {
         let ms = Date.now() - new Date(message.sentAt).getTime()
         if (ms <= MS_IN_A_DAY) {
            setTimeAgo(moment(message.sentAt).format('LT'))
         }
         else if (ms > MS_IN_A_DAY) {
            setTimeAgo(moment(message.sentAt).startOf('day').fromNow())
         }
      }

      if (message) {
         formatLastMessage()
         formatTimeAgo()
      }

   }, [message, userId, socket, token])

   return (
      <Link to={`/messages/${type}/${id}`}>
         <div className='cl-item d-flex px-5 py-3'>
            {thumbnail ? <img src={thumbnail} alt='Group Thumbnail' /> :
               <div className='initial circle pos-rel'>
                  <p className='to-center'>{initial}</p>
               </div>
            }
            <div className='pl-5 pt-1 w-100'>
               <div className='d-flex'>
                  <p className='title mw-max'>{name}</p>
                  <div className="spacer"></div>
                  <p className="time mw-max mt-1">{timeAgo}</p>
               </div>
               <p className='message'>{lastMessage}</p>
            </div>
         </div>
      </Link>
   );
}

export default ConversationsListItem;
