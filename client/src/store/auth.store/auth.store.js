
import { User } from "../../axios/configs.axios"

const initialState = () => ({
   currentUser: {},
   isAuth: false,
   initializing: true,
   socket: null
})

const actions = {
   setState: payloads => ({
      type: "SET_STATE",
      payload: payloads
   }),
   fetchUser: () => (async dispatch => {
      try {
         User.defaults.headers['access-token'] = localStorage.getItem("access-token")
         let user = (await User.get()).data
         if (user) {
            dispatch(setState({ currentUser: user, isAuth: true, initializing: false }))
         } else {
            dispatch(setState({ isAuth: false, initializing: false }))
         }
      } catch (error) {
         console.log(error.response)
         //let { status, data } = error.response
         //console.log(status, data.message)
         dispatch(setState({ isAuth: false, initializing: false }))
      }
   })
}

const mutations = {
   SET_STATE: (state, payload) => {
      let newState = {}
      Object.keys(payload).forEach(key => newState[key] = payload[key])
      return { ...state, ...newState }
   }
}

const reducer = (state = initialState(), action) => {
   let { type, payload } = action
   let mutation = mutations[type]
   let newState = mutation ? mutation(state, payload) : state
   return { ...state, ...newState }
}

// Exports
export const fetchUser = actions.fetchUser
export const setState = actions.setState
export const authReducer = reducer