const mutations = {
   SET_TOKEN: (state, token) => {
      localStorage.setItem('accessToken', token)
      return { ...state, accessToken: token }
   },
   SET_STATE: (state, payload) => {
      console.log("SET_STATE", payload)
      Object.keys(payload).forEach(k => state[k] = payload[k])
      return state
   },
   RESET_STATE: (state, initialState) => {
      localStorage.removeItem("accessToken")
      let newState = { ...state }, socket = state.socket
      Object.keys(initialState).forEach(key => { newState[key] = initialState[key] })
      return { ...newState, socket }
   }
}
export const AuthReducer = (state, action) => {
   if (action && state) {
      let { type, payload } = action
      let mutation = mutations[type]
      let newState = mutation ? mutation(state, payload) : state
      return { ...state, ...newState }
   }
}