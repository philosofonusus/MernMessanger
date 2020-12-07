import React, { useReducer, createContext, useCallback, useEffect } from 'react'
import createAction from "./ContextActions"
import { AuthReducer } from "./reducers/AuthReducer"
import io from "socket.io-client"

const DEV_API = "http://localhost:3875"

// Initial states
const initialState = {
   accessToken: null, socket: null,
   currentUser: null, isAuth: false
}

export const initState = { ...initialState }
export const AuthContext = createContext(initialState)
export const AuthProvider = ({ children }) => {

   const [state, dispatch] = useReducer(AuthReducer, initialState)

   let { SET_STATE, SET_TOKEN, RESET_STATE } = createAction(dispatch)

   const setState = useCallback(SET_STATE, [])
   const resetState = useCallback(RESET_STATE, [])
   const setToken = useCallback(SET_TOKEN, [])

   useEffect(() => {
      console.log("AC - [setState]")
      setState({ socket: io(DEV_API), accessToken: localStorage.getItem('accessToken') })
   }, [setState])

   return (
      <AuthContext.Provider value={{ ...state, setState, resetState, setToken }}>
         {children}
      </AuthContext.Provider>
   )
}