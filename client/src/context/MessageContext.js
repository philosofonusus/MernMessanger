import React, { useReducer, createContext, useCallback } from 'react'
import createAction from "./ContextActions"
import { MessageReducer } from "./reducers/MessageReducer"

// Message
import Message from "../pages/Messages"

// Initial states
const initialState = {
   conversations: [],
   friends: []
}

export const messageState = { ...initialState }
export const MessageContext = createContext(initialState)
export const MessageProvider = props => {

   const [state, dispatch] = useReducer(MessageReducer, initialState)

   let { SET_STATE, RESET_STATE } = createAction(dispatch)

   const setMessageState = useCallback(SET_STATE, [])
   const resetMessageState = useCallback(RESET_STATE, [])

   return (
      <MessageContext.Provider value={{
         ...state,
         setMessageState,
         resetMessageState
      }}>
         <Message props={props} />
      </MessageContext.Provider>
   )
}