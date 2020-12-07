
import { User } from "../../axios/configs.axios"

const initialState = () => ({
   groups: [],
   groupsFetching: false
})

const actions = {
   setState: payloads => ({
      type: "SET_STATE",
      payload: payloads
   }),
   fetchGroupsList: me => (async dispatch => {
      dispatch(setState({ groupsFetching: true }))
      try {
         let groups = (await User.get(`/${me}/groups?select=name,thumbnail`)).data
         dispatch(setState({ groups, groupsFetching: false }))
         //console.log("Groups => ", groups)
      } catch (error) {
         //console.log("fetchGroups", error.response)
         dispatch(setState({ groupsFetching: false }))
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
export const fetchGroupsList = actions.fetchGroupsList
export const setState = actions.setState
export const groupReducer = reducer